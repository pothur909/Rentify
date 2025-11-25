const Razorpay = require('razorpay');
const crypto = require('crypto');
const Broker = require('../models/Broker');
const LeadPackage = require('../models/LeadPackage');
const PaymentTransaction = require('../models/PaymentTransaction');
const WebhookLog = require('../models/PaymentWebhook');
const { assignLeadPackageToBroker } = require('./packagesController');


if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Razorpay env vars missing');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generateReceiptId = (brokerId, packageId) => {
  const ts = Date.now().toString();
  const random = Math.random().toString(36).slice(2, 8);
  return `BROKER_${brokerId}_${packageId}_${ts}_${random}`.slice(0, 40);
};



// POST /api/payments/create-order
// body: { brokerId, packageKey }

exports.createOrder = async (req, res) => {
  try {
    const { brokerId, packageKey } = req.body;

    if (!brokerId || !packageKey) {
      return res.status(400).json({
        success: false,
        message: "brokerId and packageKey are required",
      });
    }

    const broker = await Broker.findById(brokerId);
    if (!broker) {
      return res.status(404).json({
        success: false,
        message: "Broker not found",
      });
    }

    // Try to find package in DB
    let pkg = await LeadPackage.findOne({ key: packageKey, isActive: true });

    // If not found, try to bootstrap from PACKAGE_CONFIG
    if (!pkg) {
      return res.status(400).json({
        success: false,
        message: 'Invalid packageKey or package inactive',
      });
    }
    const amountInPaise = pkg.price * 100;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: generateReceiptId(brokerId, pkg._id.toString()),
      notes: {
        brokerId: String(brokerId),
        packageId: String(pkg._id),
        packageKey: pkg.key,
        packageName: pkg.name,
      },
    });

    const tx = await PaymentTransaction.create({
      brokerId: broker._id,
      packageId: pkg._id,
      amount: pkg.price,
      currency: "INR",
      orderId: order.id,
      status: "created",
      razorpayOrder: order,
    });

    return res.json({
      success: true,
      order,
      transactionId: tx._id,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Error in createOrder", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: err.message,
    });
  }
};


// POST /api/payments/webhook
// raw middleware in app.js sets req.rawBody; router sets req.body + req.rawBuffer
exports.handleWebhook = async (req, res) => {
  const rawBuffer = req.rawBuffer;

  if (!rawBuffer || !Buffer.isBuffer(rawBuffer)) {
    console.error('No rawBuffer on request');
    return res.status(400).json({ success: false, message: 'No raw body found' });
  }

  const body = req.body;
  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // create initial webhook log
  let webhookLog = await WebhookLog.create({
    event: body.event,
    orderId:
      body.payload?.order?.entity?.id ||
      body.payload?.payment?.entity?.order_id ||
      null,
    paymentId: body.payload?.payment?.entity?.id || null,
    rawPayload: body,
    headers: req.headers,
    signatureVerified: false,
    responseStatusCode: 200,
    processingMessage: 'Webhook received',
  });

  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
    webhookLog.responseStatusCode = 500;
    webhookLog.processingMessage = 'Webhook secret not configured';
    await webhookLog.save();
    return res.status(500).json({ success: false, message: 'Webhook secret not configured' });
  }

  if (!signature) {
    console.error('Missing Razorpay signature');
    webhookLog.responseStatusCode = 400;
    webhookLog.processingMessage = 'Missing webhook signature';
    await webhookLog.save();
    return res.status(400).json({ success: false, message: 'Missing webhook signature' });
  }

  let expectedSignature;
  try {
    expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBuffer)
      .digest('hex');
  } catch (err) {
    console.error('Error generating expected signature', err);
    webhookLog.responseStatusCode = 500;
    webhookLog.processingMessage = 'Signature generation error';
    webhookLog.error = { message: err.message, stack: err.stack };
    await webhookLog.save();
    return res.status(500).json({ success: false, message: 'Signature generation error' });
  }

  if (expectedSignature !== signature) {
    console.error('Invalid webhook signature', {
      expected: expectedSignature,
      received: signature,
    });
    webhookLog.responseStatusCode = 401;
    webhookLog.processingMessage = 'Invalid webhook signature';
    webhookLog.error = { message: 'Invalid signature' };
    await webhookLog.save();
    return res.status(401).json({ success: false, message: 'Invalid signature' });
  }

  webhookLog.signatureVerified = true;
  await webhookLog.save();

  const event = body.event;
  const paymentEntity = body.payload?.payment?.entity || {};
  const orderId =
    body.payload?.order?.entity?.id ||
    paymentEntity.order_id ||
    null;
  const paymentId = paymentEntity.id || null;

  console.log('Webhook signature verified');
  console.log('Event:', event);

  if (!orderId) {
    console.error('order_id missing in payload');
    webhookLog.responseStatusCode = 400;
    webhookLog.processingMessage = 'order_id missing in payload';
    await webhookLog.save();
    return res.status(400).json({ success: false, message: 'order_id missing in payload' });
  }

  const successEvents = ['payment.captured', 'order.paid'];
  const failureEvents = ['payment.failed', 'order.failed'];
  const relevant = [...successEvents, ...failureEvents];

  if (!relevant.includes(event)) {
    console.log('Ignoring event:', event);
    webhookLog.processingMessage = `Event ${event} ignored`;
    webhookLog.responseStatusCode = 200;
    await webhookLog.save();
    return res.json({ success: true, message: 'Event ignored' });
  }

  try {
    const tx = await PaymentTransaction.findOne({ orderId });

    if (!tx) {
      console.error('PaymentTransaction not found for orderId', orderId);
      webhookLog.responseStatusCode = 404;
      webhookLog.processingMessage = 'Transaction not found';
      await webhookLog.save();
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    tx.razorpayEvents.push(body);
    tx.webhookSignatureVerified = true;
    tx.webhookLastEvent = event;

const broker = await Broker.findById(tx.brokerId);

if (broker && paymentId && !broker.paymentIds.includes(paymentId)) {
  broker.paymentIds.push(paymentId);
  await broker.save();
}

    if (successEvents.includes(event)) {
      tx.status = 'paid';
      if (!tx.paidAt) {
        tx.paidAt = new Date();
      }
      await tx.save();

            // call your controller to assign package to broker
      if (tx.brokerId && tx.packageId) {
        const internalReq = {
          body: {
            brokerId: tx.brokerId.toString(),
            packageId: tx.packageId.toString(),
          },
        };

        // lightweight internal response object
        const internalRes = {
          status(code) {
            this.statusCode = code;
            return this;
          },
          json(payload) {
            console.log(
              'assignLeadPackageToBroker internal response:',
              this.statusCode || 200,
              payload
            );
          },
        };

        const internalNext = (err) => {
          if (err) {
            console.error('assignLeadPackageToBroker error from webhook:', err);
          }
        };

        await assignLeadPackageToBroker(internalReq, internalRes, internalNext);
      }

      webhookLog.processingMessage = 'Payment marked as paid';
      webhookLog.responseStatusCode = 200;
      await webhookLog.save();

      console.log('Payment marked as paid for order', orderId);
      return res.json({ success: true, message: 'Payment marked as paid' });
    }

    if (failureEvents.includes(event)) {
      tx.status = 'failed';
      await tx.save();

      webhookLog.processingMessage = 'Payment marked as failed';
      webhookLog.responseStatusCode = 400;
      await webhookLog.save();

      console.log('Payment marked as failed for order', orderId);
      return res.status(400).json({ success: false, message: 'Payment marked as failed' });
    }

    // should not really hit this, but just in case
    await tx.save();
    webhookLog.processingMessage = 'Event stored';
    webhookLog.responseStatusCode = 200;
    await webhookLog.save();

    return res.json({ success: true, message: 'Event stored' });
  } catch (err) {
    console.error('Webhook handler error', err);
    webhookLog.responseStatusCode = 500;
    webhookLog.processingMessage = 'Webhook error';
    webhookLog.error = { message: err.message, stack: err.stack };
    await webhookLog.save();
    return res.status(500).json({
      success: false,
      message: 'Webhook error',
      error: err.message,
    });
  }
};

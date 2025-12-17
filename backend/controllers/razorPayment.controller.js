// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const Broker = require('../models/Broker');
// const LeadPackage = require('../models/LeadPackage');
// const PaymentTransaction = require('../models/PaymentTransaction');
// const PaymentSubscription = require('../models/PaymentSubcription');
// const WebhookLog = require('../models/PaymentWebhook');
// const { assignLeadPackageToBroker } = require('./packagesController');


// if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
//   console.error('Razorpay env vars missing');
// }

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// const generateReceiptId = (brokerId, packageId) => {
//   const ts = Date.now().toString();
//   const random = Math.random().toString(36).slice(2, 8);
//   return `BROKER_${brokerId}_${packageId}_${ts}_${random}`.slice(0, 40);
// };



// // POST /api/payments/create-order
// // body: { brokerId, packageKey }

// exports.createOrder = async (req, res) => {
//   try {
//     const { brokerId, packageKey } = req.body;

//     if (!brokerId || !packageKey) {
//       return res.status(400).json({
//         success: false,
//         message: "brokerId and packageKey are required",
//       });
//     }

//     const broker = await Broker.findById(brokerId);
//     if (!broker) {
//       return res.status(404).json({
//         success: false,
//         message: "Broker not found",
//       });
//     }

//     // Try to find package in DB
//     let pkg = await LeadPackage.findOne({ key: packageKey, isActive: true });

//     // If not found, try to bootstrap from PACKAGE_CONFIG
//     if (!pkg) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid packageKey or package inactive',
//       });
//     }
//     const amountInPaise = pkg.price * 100;

//     const order = await razorpay.orders.create({
//       amount: amountInPaise,
//       currency: "INR",
//       receipt: generateReceiptId(brokerId, pkg._id.toString()),
//       notes: {
//         brokerId: String(brokerId),
//         packageId: String(pkg._id),
//         packageKey: pkg.key,
//         packageName: pkg.name,
//       },
//     });

//     const tx = await PaymentTransaction.create({
//       brokerId: broker._id,
//       packageId: pkg._id,
//       amount: pkg.price,
//       currency: "INR",
//       orderId: order.id,
//       status: "created",
//       razorpayOrder: order,
//     });

//     return res.json({
//       success: true,
//       order,
//       transactionId: tx._id,
//       keyId: process.env.RAZORPAY_KEY_ID,
//     });
//   } catch (err) {
//     console.error("Error in createOrder", err);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to create order",
//       error: err.message,
//     });
//   }
// };


// // POST /api/payments/webhook
// // raw middleware in app.js sets req.rawBody; router sets req.body + req.rawBuffer
// exports.handleWebhook = async (req, res) => {
//   const rawBuffer = req.rawBuffer;

//   if (!rawBuffer || !Buffer.isBuffer(rawBuffer)) {
//     console.error('No rawBuffer on request');
//     return res.status(400).json({ success: false, message: 'No raw body found' });
//   }

//   const body = req.body;
//   const signature = req.headers['x-razorpay-signature'];
//   const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

//   // create initial webhook log
//   let webhookLog = await WebhookLog.create({
//     event: body.event,
//     orderId:
//       body.payload?.order?.entity?.id ||
//       body.payload?.payment?.entity?.order_id ||
//       null,
//     paymentId: body.payload?.payment?.entity?.id || null,
//     rawPayload: body,
//     headers: req.headers,
//     signatureVerified: false,
//     responseStatusCode: 200,
//     processingMessage: 'Webhook received',
//   });

//   if (!webhookSecret) {
//     console.error('RAZORPAY_WEBHOOK_SECRET is not configured');
//     webhookLog.responseStatusCode = 500;
//     webhookLog.processingMessage = 'Webhook secret not configured';
//     await webhookLog.save();
//     return res.status(500).json({ success: false, message: 'Webhook secret not configured' });
//   }

//   if (!signature) {
//     console.error('Missing Razorpay signature');
//     webhookLog.responseStatusCode = 400;
//     webhookLog.processingMessage = 'Missing webhook signature';
//     await webhookLog.save();
//     return res.status(400).json({ success: false, message: 'Missing webhook signature' });
//   }

//   let expectedSignature;
//   try {
//     expectedSignature = crypto
//       .createHmac('sha256', webhookSecret)
//       .update(rawBuffer)
//       .digest('hex');
//   } catch (err) {
//     console.error('Error generating expected signature', err);
//     webhookLog.responseStatusCode = 500;
//     webhookLog.processingMessage = 'Signature generation error';
//     webhookLog.error = { message: err.message, stack: err.stack };
//     await webhookLog.save();
//     return res.status(500).json({ success: false, message: 'Signature generation error' });
//   }

//   if (expectedSignature !== signature) {
//     console.error('Invalid webhook signature', {
//       expected: expectedSignature,
//       received: signature,
//     });
//     webhookLog.responseStatusCode = 401;
//     webhookLog.processingMessage = 'Invalid webhook signature';
//     webhookLog.error = { message: 'Invalid signature' };
//     await webhookLog.save();
//     return res.status(401).json({ success: false, message: 'Invalid signature' });
//   }

//   webhookLog.signatureVerified = true;
//   await webhookLog.save();

//   const event = body.event;
//   const paymentEntity = body.payload?.payment?.entity || {};
//   const orderId =
//     body.payload?.order?.entity?.id ||
//     paymentEntity.order_id ||
//     null;
//   const paymentId = paymentEntity.id || null;

//   console.log('Webhook signature verified');
//   console.log('Event:', event);

//   if (!orderId) {
//     console.error('order_id missing in payload');
//     webhookLog.responseStatusCode = 400;
//     webhookLog.processingMessage = 'order_id missing in payload';
//     await webhookLog.save();
//     return res.status(400).json({ success: false, message: 'order_id missing in payload' });
//   }

//   const successEvents = ['payment.captured', 'order.paid'];
//   const failureEvents = ['payment.failed', 'order.failed'];
//   const relevant = [...successEvents, ...failureEvents];

//   if (!relevant.includes(event)) {
//     console.log('Ignoring event:', event);
//     webhookLog.processingMessage = `Event ${event} ignored`;
//     webhookLog.responseStatusCode = 200;
//     await webhookLog.save();
//     return res.json({ success: true, message: 'Event ignored' });
//   }

//   try {
//     const tx = await PaymentTransaction.findOne({ orderId });

//     if (!tx) {
//       console.error('PaymentTransaction not found for orderId', orderId);
//       webhookLog.responseStatusCode = 404;
//       webhookLog.processingMessage = 'Transaction not found';
//       await webhookLog.save();
//       return res.status(404).json({ success: false, message: 'Transaction not found' });
//     }

//     tx.razorpayEvents.push(body);
//     tx.webhookSignatureVerified = true;
//     tx.webhookLastEvent = event;

// const broker = await Broker.findById(tx.brokerId);

// if (broker && paymentId && !broker.paymentIds.includes(paymentId)) {
//   broker.paymentIds.push(paymentId);
//   await broker.save();
// }

//     if (successEvents.includes(event)) {
//       tx.status = 'paid';
//       if (!tx.paidAt) {
//         tx.paidAt = new Date();
//       }
//       await tx.save();

//             // call your controller to assign package to broker
//       if (tx.brokerId && tx.packageId) {
//         const internalReq = {
//           body: {
//             brokerId: tx.brokerId.toString(),
//             packageId: tx.packageId.toString(),
//           },
//         };

//         // lightweight internal response object
//         const internalRes = {
//           status(code) {
//             this.statusCode = code;
//             return this;
//           },
//           json(payload) {
//             console.log(
//               'assignLeadPackageToBroker internal response:',
//               this.statusCode || 200,
//               payload
//             );
//           },
//         };

//         const internalNext = (err) => {
//           if (err) {
//             console.error('assignLeadPackageToBroker error from webhook:', err);
//           }
//         };

//         await assignLeadPackageToBroker(internalReq, internalRes, internalNext);
//       }

//       webhookLog.processingMessage = 'Payment marked as paid';
//       webhookLog.responseStatusCode = 200;
//       await webhookLog.save();

//       console.log('Payment marked as paid for order', orderId);
//       return res.json({ success: true, message: 'Payment marked as paid' });
//     }

//     if (failureEvents.includes(event)) {
//       tx.status = 'failed';
//       await tx.save();

//       webhookLog.processingMessage = 'Payment marked as failed';
//       webhookLog.responseStatusCode = 400;
//       await webhookLog.save();

//       console.log('Payment marked as failed for order', orderId);
//       return res.status(400).json({ success: false, message: 'Payment marked as failed' });
//     }

//     // should not really hit this, but just in case
//     await tx.save();
//     webhookLog.processingMessage = 'Event stored';
//     webhookLog.responseStatusCode = 200;
//     await webhookLog.save();

//     return res.json({ success: true, message: 'Event stored' });
//   } catch (err) {
//     console.error('Webhook handler error', err);
//     webhookLog.responseStatusCode = 500;
//     webhookLog.processingMessage = 'Webhook error';
//     webhookLog.error = { message: err.message, stack: err.stack };
//     await webhookLog.save();
//     return res.status(500).json({
//       success: false,
//       message: 'Webhook error',
//       error: err.message,
//     });
//   }
// };

const Razorpay = require('razorpay');
const crypto = require('crypto');
const Broker = require('../models/Broker');
const LeadPackage = require('../models/LeadPackage');
const PaymentTransaction = require('../models/PaymentTransaction');
const PaymentSubscription = require('../models/PaymentSubcription');
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


// POST /api/payments/create-checkout
// body: { brokerId, packageKey, autoRenew }
exports.createCheckout = async (req, res) => {
  try {
    const { brokerId, packageKey, autoRenew } = req.body;

    if (!brokerId || !packageKey) {
      return res.status(400).json({
        success: false,
        message: 'brokerId and packageKey are required',
      });
    }

    const broker = await Broker.findById(brokerId);
    if (!broker) {
      return res.status(404).json({
        success: false,
        message: 'Broker not found',
      });
    }

    const pkg = await LeadPackage.findOne({ key: packageKey, isActive: true });
    if (!pkg) {
      return res.status(400).json({
        success: false,
        message: 'Invalid packageKey or inactive package',
      });
    }

    const amountInPaise = pkg.price * 100;
    const shouldAutoRenew = Boolean(autoRenew);

    // one time payment
    if (!shouldAutoRenew) {
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: generateReceiptId(brokerId, pkg._id.toString()),
        notes: {
          brokerId: String(brokerId),
          packageId: String(pkg._id),
          packageKey: pkg.key,
          packageName: pkg.name,
        },
      });

      // const tx = await PaymentTransaction.create({
      //   brokerId: broker._id,
      //   packageId: pkg._id,
      //   amount: pkg.price,
      //   currency: 'INR',
      //   orderId: order.id,
      //   status: 'created',
      //   razorpayOrder: order,
      //   autoRenew: false,
      // });
      const tx = await PaymentTransaction.create({
  brokerId: broker._id,
  packageId: pkg._id,
  amount: pkg.price,
  currency: "INR",
  orderId: order.id,
  status: "created",
  razorpayOrder: order,

  mode: "one_time",
  autoRenew: false,
});


      return res.json({
        success: true,
        mode: 'one_time',
        order,
        transactionId: tx._id,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    // subscription flow
    if (!pkg.razorpayPlanId) {
      return res.status(400).json({
        success: false,
        message: 'This package is not configured for subscriptions',
      });
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: pkg.razorpayPlanId,
      customer_notify: 1,
      quantity: 1,
      total_count: 60, // until cancelled
      notes: {
        brokerId: String(brokerId),
        packageId: String(pkg._id),
        packageKey: pkg.key,
      },
    });

    const subDoc = await PaymentSubscription.create({
      brokerId: broker._id,
      packageId: pkg._id,
      razorpaySubscriptionId: subscription.id,
      status: subscription.status || 'created',
      totalCount: subscription.total_count,
      remainingCount: subscription.remaining_count,
      currentCycleStart: subscription.current_start
        ? new Date(subscription.current_start * 1000)
        : null,
      currentCycleEnd: subscription.current_end
        ? new Date(subscription.current_end * 1000)
        : null,
      notes: subscription.notes || {},
      rawRazorpayObject: subscription,
    });

    return res.json({
      success: true,
      mode: 'subscription',
      subscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentSubscriptionId: subDoc._id,
    });
  } catch (err) {
    console.error('Error in createCheckout', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create checkout',
      error: err.message,
    });
  }
};

// helper for subscription events
async function handleSubscriptionEvent(body) {
  const event = body.event;
  const subEntity = body.payload?.subscription?.entity;
  if (!subEntity) {
    console.log('No subscription entity in payload');
    return;
  }

  const razorpaySubscriptionId = subEntity.id;
  if (!razorpaySubscriptionId) {
    console.log('No subscription id in entity');
    return;
  }

  const paymentSub = await PaymentSubscription.findOne({
    razorpaySubscriptionId,
  });

  if (!paymentSub) {
    console.log('PaymentSubscription not found for', razorpaySubscriptionId);
    return;
  }

  paymentSub.status = subEntity.status || paymentSub.status;
  paymentSub.totalCount = subEntity.total_count;
  paymentSub.remainingCount = subEntity.remaining_count;
  paymentSub.currentCycleStart = subEntity.current_start
    ? new Date(subEntity.current_start * 1000)
    : paymentSub.currentCycleStart;
  paymentSub.currentCycleEnd = subEntity.current_end
    ? new Date(subEntity.current_end * 1000)
    : paymentSub.currentCycleEnd;
  paymentSub.rawRazorpayObject = subEntity;

  await paymentSub.save();

  if (event === 'subscription.activated' || event === 'subscription.charged') {
    if (!paymentSub.brokerId || !paymentSub.packageId) {
      console.log('PaymentSubscription missing brokerId or packageId');
      return;
    }

    const internalReq = {
      body: {
        brokerId: paymentSub.brokerId.toString(),
        packageId: paymentSub.packageId.toString(),
      },
    };

    const internalRes = {
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        console.log(
          'assignLeadPackageToBroker from subscription event:',
          this.statusCode || 200,
          payload
        );
      },
    };

    const internalNext = err => {
      if (err) {
        console.error('assignLeadPackageToBroker error from subscription:', err);
      }
    };

    await assignLeadPackageToBroker(internalReq, internalRes, internalNext);
  }
}

// POST /api/payments/webhook
// exports.handleWebhook = async (req, res) => {
//   const rawBuffer = req.rawBuffer;

//   if (!rawBuffer || !Buffer.isBuffer(rawBuffer)) {
//     console.error('No rawBuffer on request');
//     return res.status(400).json({ success: false, message: 'No raw body found' });
//   }

//   const body = req.body;
//   const signature = req.headers['x-razorpay-signature'];
//   const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

//   let webhookLog = await WebhookLog.create({
//     event: body.event,
//     orderId:
//       body.payload?.order?.entity?.id ||
//       body.payload?.payment?.entity?.order_id ||
//       null,
//     paymentId: body.payload?.payment?.entity?.id || null,
//     rawPayload: body,
//     headers: req.headers,
//     signatureVerified: false,
//     responseStatusCode: 200,
//     processingMessage: 'Webhook received',
//   });

//   if (!webhookSecret) {
//     webhookLog.responseStatusCode = 500;
//     webhookLog.processingMessage = 'Webhook secret not configured';
//     await webhookLog.save();
//     return res
//       .status(500)
//       .json({ success: false, message: 'Webhook secret not configured' });
//   }

//   if (!signature) {
//     webhookLog.responseStatusCode = 400;
//     webhookLog.processingMessage = 'Missing webhook signature';
//     await webhookLog.save();
//     return res
//       .status(400)
//       .json({ success: false, message: 'Missing webhook signature' });
//   }

//   let expectedSignature;
//   try {
//     expectedSignature = crypto
//       .createHmac('sha256', webhookSecret)
//       .update(rawBuffer)
//       .digest('hex');
//   } catch (err) {
//     webhookLog.responseStatusCode = 500;
//     webhookLog.processingMessage = 'Signature generation error';
//     webhookLog.error = { message: err.message, stack: err.stack };
//     await webhookLog.save();
//     return res
//       .status(500)
//       .json({ success: false, message: 'Signature generation error' });
//   }

//   if (expectedSignature !== signature) {
//     webhookLog.responseStatusCode = 401;
//     webhookLog.processingMessage = 'Invalid webhook signature';
//     webhookLog.error = { message: 'Invalid signature' };
//     await webhookLog.save();
//     return res.status(401).json({ success: false, message: 'Invalid signature' });
//   }

//   webhookLog.signatureVerified = true;
//   await webhookLog.save();

//   const event = body.event;
//   const paymentEntity = body.payload?.payment?.entity || {};
//   const orderId =
//     body.payload?.order?.entity?.id || paymentEntity.order_id || null;
//   const paymentId = paymentEntity.id || null;

//   console.log('Webhook verified, event:', event);

//   // Subscription events
//   if (event && event.startsWith('subscription.')) {
//     try {
//       await handleSubscriptionEvent(body);
//       webhookLog.processingMessage = `Subscription event ${event} processed`;
//       webhookLog.responseStatusCode = 200;
//       await webhookLog.save();
//       return res.json({ success: true, message: 'Subscription event processed' });
//     } catch (err) {
//       console.error('handleSubscriptionEvent error', err);
//       webhookLog.processingMessage = 'Subscription event error';
//       webhookLog.responseStatusCode = 500;
//       webhookLog.error = { message: err.message, stack: err.stack };
//       await webhookLog.save();
//       return res
//         .status(500)
//         .json({ success: false, message: 'Subscription event error' });
//     }
//   }

//   const successEvents = ['payment.captured', 'order.paid'];
//   const failureEvents = ['payment.failed', 'order.failed'];
//   const relevant = [...successEvents, ...failureEvents];

//   if (!relevant.includes(event)) {
//     webhookLog.processingMessage = `Event ${event} ignored`;
//     webhookLog.responseStatusCode = 200;
//     await webhookLog.save();
//     return res.json({ success: true, message: 'Event ignored' });
//   }

//   if (!orderId) {
//     webhookLog.responseStatusCode = 400;
//     webhookLog.processingMessage = 'order_id missing in payload';
//     await webhookLog.save();
//     return res
//       .status(400)
//       .json({ success: false, message: 'order_id missing in payload' });
//   }

//   try {
//     const tx = await PaymentTransaction.findOne({ orderId });

//     if (!tx) {
//       webhookLog.responseStatusCode = 404;
//       webhookLog.processingMessage = 'Transaction not found';
//       await webhookLog.save();
//       return res
//         .status(404)
//         .json({ success: false, message: 'Transaction not found' });
//     }

//     tx.razorpayEvents.push(body);
//     tx.webhookSignatureVerified = true;
//     tx.webhookLastEvent = event;

//     const broker = await Broker.findById(tx.brokerId);
//     if (broker && paymentId && !broker.paymentIds.includes(paymentId)) {
//       broker.paymentIds.push(paymentId);
//       await broker.save();
//     }

//     if (successEvents.includes(event)) {
//       tx.status = 'paid';
//       if (!tx.paidAt) {
//         tx.paidAt = new Date();
//       }
//       await tx.save();

//       if (tx.brokerId && tx.packageId) {
//         const internalReq = {
//           body: {
//             brokerId: tx.brokerId.toString(),
//             packageId: tx.packageId.toString(),
//           },
//         };

//         const internalRes = {
//           status(code) {
//             this.statusCode = code;
//             return this;
//           },
//           json(payload) {
//             console.log(
//               'assignLeadPackageToBroker from webhook:',
//               this.statusCode || 200,
//               payload
//             );
//           },
//         };

//         const internalNext = err => {
//           if (err) {
//             console.error('assignLeadPackageToBroker error from webhook:', err);
//           }
//         };

//         await assignLeadPackageToBroker(internalReq, internalRes, internalNext);
//       }

//       webhookLog.processingMessage = 'Payment marked as paid';
//       webhookLog.responseStatusCode = 200;
//       await webhookLog.save();
//       return res.json({
//         success: true,
//         message: 'Payment marked as paid',
//       });
//     }

//     if (failureEvents.includes(event)) {
//       tx.status = 'failed';
//       await tx.save();
//       webhookLog.processingMessage = 'Payment marked as failed';
//       webhookLog.responseStatusCode = 400;
//       await webhookLog.save();
//       return res
//         .status(400)
//         .json({ success: false, message: 'Payment marked as failed' });
//     }

//     await tx.save();
//     webhookLog.processingMessage = 'Event stored';
//     webhookLog.responseStatusCode = 200;
//     await webhookLog.save();

//     return res.json({ success: true, message: 'Event stored' });
//   } catch (err) {
//     console.error('Webhook handler error', err);
//     webhookLog.responseStatusCode = 500;
//     webhookLog.processingMessage = 'Webhook error';
//     webhookLog.error = { message: err.message, stack: err.stack };
//     await webhookLog.save();
//     return res.status(500).json({
//       success: false,
//       message: 'Webhook error',
//       error: err.message,
//     });
//   }
// };

// async function handleInvoiceEvent(body) {
//   const event = body.event;

//   // We care only about successful recurring payments
//   if (event !== "invoice.paid") return;

//   const invoice = body.payload?.invoice?.entity;
//   if (!invoice) {
//     console.log("No invoice entity in payload");
//     return;
//   }

//   // invoice.subscription_id is the key link for recurring
//   const subscriptionId = invoice.subscription_id;
//   if (!subscriptionId) {
//     console.log("invoice.subscription_id missing, not a subscription invoice");
//     return;
//   }

//   // Find your internal subscription doc
//   const paymentSub = await PaymentSubscription.findOne({
//     razorpaySubscriptionId: subscriptionId,
//   });

//   if (!paymentSub) {
//     console.log("PaymentSubscription not found for", subscriptionId);
//     return;
//   }

//   // Payment entity (may exist in invoice payload)
//   const payment = body.payload?.payment?.entity || null;

//   const paymentId = payment?.id || null;
//   const orderId = payment?.order_id || null;
//   const invoiceId = invoice.id || null;

//   // ✅ Idempotency: do not store duplicates if Razorpay retries webhook
//   // Pick ONE unique key. paymentId is best.
//   if (paymentId) {
//     const already = await PaymentTransaction.findOne({ paymentId });
//     if (already) {
//       console.log("Recurring payment already stored:", paymentId);
//       return;
//     }
//   }

//   // Create a transaction row for this monthly charge
//   const amountInRupees = (invoice.amount_paid || invoice.amount || 0) / 100;

//   await PaymentTransaction.create({
//     brokerId: paymentSub.brokerId,
//     packageId: paymentSub.packageId,

//     // add these fields to schema if not present, otherwise keep as extra keys
//     paymentId,
//     orderId,
//     invoiceId,
//     subscriptionId,

//     amount: amountInRupees,
//     currency: invoice.currency || "INR",
//     status: "paid",
//     paidAt: new Date(),

//     // optional: store raw for debugging
//     razorpayEvents: [body],
//     autoRenew: true,
//   });

//   // ✅ Your leads logic for each renewal
//   // Call your assignLeadPackageToBroker here so every cycle top ups leads
//   const internalReq = {
//     body: {
//       brokerId: paymentSub.brokerId.toString(),
//       packageId: paymentSub.packageId.toString(),
//     },
//   };

//   const internalRes = {
//     status(code) {
//       this.statusCode = code;
//       return this;
//     },
//     json(payload) {
//       console.log("assignLeadPackageToBroker from invoice.paid:", this.statusCode || 200, payload);
//     },
//   };

//   const internalNext = (err) => {
//     if (err) console.error("assignLeadPackageToBroker error from invoice.paid:", err);
//   };

//   await assignLeadPackageToBroker(internalReq, internalRes, internalNext);

//   console.log("Stored recurring transaction + assigned package for invoice:", invoiceId);
// }

async function handleInvoiceEvent(body) {
  const event = body?.event;

  // Only store successful recurring payments
  if (event !== "invoice.paid") return;

  const invoice = body?.payload?.invoice?.entity;
  if (!invoice) {
    console.log("No invoice entity in payload");
    return;
  }

  // Key link for recurring payments
  const subscriptionId = invoice.subscription_id;
  if (!subscriptionId) {
    console.log("invoice.subscription_id missing, not a subscription invoice");
    return;
  }

  // Find your internal subscription doc
  const paymentSub = await PaymentSubscription.findOne({
    razorpaySubscriptionId: subscriptionId,
  });

  if (!paymentSub) {
    console.log("PaymentSubscription not found for", subscriptionId);
    return;
  }

  // Razorpay sends ids inside invoice entity itself
  const invoiceId = invoice.id || null;
  const paymentId = invoice.payment_id || body?.payload?.payment?.entity?.id || null;
  const orderId = invoice.order_id || body?.payload?.payment?.entity?.order_id || null;

  // Idempotency (Razorpay retries webhooks)
  // Prefer paymentId, else invoiceId
  if (paymentId) {
    const already = await PaymentTransaction.findOne({ paymentId });
    if (already) {
      console.log("Recurring payment already stored (paymentId):", paymentId);
      return;
    }
  } else if (invoiceId) {
    const already = await PaymentTransaction.findOne({ invoiceId });
    if (already) {
      console.log("Recurring payment already stored (invoiceId):", invoiceId);
      return;
    }
  }

  // Amount from invoice is in paise
  const amountInRupees = (invoice.amount_paid || invoice.amount || 0) / 100;

  // paid_at is epoch seconds in Razorpay invoice entity
  const paidAt = invoice.paid_at ? new Date(invoice.paid_at * 1000) : new Date();

  // Optional cycle number (simple, based on counts if present)
  const cycleNumber =
    typeof paymentSub.totalCount === "number" && typeof paymentSub.remainingCount === "number"
      ? paymentSub.totalCount - paymentSub.remainingCount
      : undefined;

  // ✅ Create a transaction row for this monthly charge
  await PaymentTransaction.create({
    brokerId: paymentSub.brokerId,
    packageId: paymentSub.packageId,

    mode: "subscription",     // ✅ REQUIRED by your schema
    autoRenew: true,          // ✅ recurring
    status: "paid",
    paidAt,

    subscriptionId,
    invoiceId,
    paymentId,
    orderId,
    cycleNumber,

    amount: amountInRupees,
    currency: invoice.currency || "INR",

    razorpayEvents: [body],
    webhookSignatureVerified: true,
    webhookLastEvent: event,
  });

  // ✅ Top up leads / reassign package on every renewal
  const internalReq = {
    body: {
      brokerId: paymentSub.brokerId.toString(),
      packageId: paymentSub.packageId.toString(),
    },
  };

  const internalRes = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      console.log(
        "assignLeadPackageToBroker from invoice.paid:",
        this.statusCode || 200,
        payload
      );
    },
  };

  const internalNext = (err) => {
    if (err) console.error("assignLeadPackageToBroker error from invoice.paid:", err);
  };

  await assignLeadPackageToBroker(internalReq, internalRes, internalNext);

  console.log("Stored recurring transaction + assigned package for invoice:", invoiceId);
}



// POST /api/payments/webhook
exports.handleWebhook = async (req, res) => {
  const rawBuffer = req.rawBuffer;

  if (!rawBuffer || !Buffer.isBuffer(rawBuffer)) {
    console.error("No rawBuffer on request");
    return res.status(400).json({ success: false, message: "No raw body found" });
  }

  const body = req.body;
  const signature = req.headers["x-razorpay-signature"];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

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
    processingMessage: "Webhook received",
  });

  if (!webhookSecret) {
    webhookLog.responseStatusCode = 500;
    webhookLog.processingMessage = "Webhook secret not configured";
    await webhookLog.save();
    return res.status(500).json({ success: false, message: "Webhook secret not configured" });
  }

  if (!signature) {
    webhookLog.responseStatusCode = 400;
    webhookLog.processingMessage = "Missing webhook signature";
    await webhookLog.save();
    return res.status(400).json({ success: false, message: "Missing webhook signature" });
  }

  let expectedSignature;
  try {
    expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBuffer)
      .digest("hex");
  } catch (err) {
    webhookLog.responseStatusCode = 500;
    webhookLog.processingMessage = "Signature generation error";
    webhookLog.error = { message: err.message, stack: err.stack };
    await webhookLog.save();
    return res.status(500).json({ success: false, message: "Signature generation error" });
  }

  if (expectedSignature !== signature) {
    webhookLog.responseStatusCode = 401;
    webhookLog.processingMessage = "Invalid webhook signature";
    webhookLog.error = { message: "Invalid signature" };
    await webhookLog.save();
    return res.status(401).json({ success: false, message: "Invalid webhook signature" });
  }

  webhookLog.signatureVerified = true;
  await webhookLog.save();

  const event = body.event;
  const paymentEntity = body.payload?.payment?.entity || {};
  const orderId = body.payload?.order?.entity?.id || paymentEntity.order_id || null;
  const paymentId = paymentEntity.id || null;

  console.log("Webhook verified, event:", event);

  // ✅ Subscription events (these should be enabled in Razorpay dashboard webhooks)
  if (event && event.startsWith("subscription.")) {
    try {
      await handleSubscriptionEvent(body);
      webhookLog.processingMessage = `Subscription event ${event} processed`;
      webhookLog.responseStatusCode = 200;
      await webhookLog.save();
      return res.json({ success: true, message: "Subscription event processed" });
    } catch (err) {
      console.error("handleSubscriptionEvent error", err);
      webhookLog.processingMessage = "Subscription event error";
      webhookLog.responseStatusCode = 500;
      webhookLog.error = { message: err.message, stack: err.stack };
      await webhookLog.save();
      return res.status(500).json({ success: false, message: "Subscription event error" });
    }
  }

  // ✅ Invoice events (recurring payment tracking)
if (event && event.startsWith("invoice.")) {
  try {
    await handleInvoiceEvent(body);
    webhookLog.processingMessage = `Invoice event ${event} processed`;
    webhookLog.responseStatusCode = 200;
    await webhookLog.save();
    return res.json({ success: true, message: "Invoice event processed" });
  } catch (err) {
    console.error("handleInvoiceEvent error", err);
    webhookLog.processingMessage = "Invoice event error";
    webhookLog.responseStatusCode = 500;
    webhookLog.error = { message: err.message, stack: err.stack };
    await webhookLog.save();
    return res.status(500).json({ success: false, message: "Invoice event error" });
  }
}


  // One-time payment events only
  const successEvents = ["payment.captured", "order.paid"];
  const failureEvents = ["payment.failed", "order.failed"];
  const relevant = [...successEvents, ...failureEvents];

  if (!relevant.includes(event)) {
    webhookLog.processingMessage = `Event ${event} ignored`;
    webhookLog.responseStatusCode = 200;
    await webhookLog.save();
    return res.json({ success: true, message: "Event ignored" });
  }

  if (!orderId) {
    webhookLog.responseStatusCode = 400;
    webhookLog.processingMessage = "order_id missing in payload";
    await webhookLog.save();
    return res.status(400).json({ success: false, message: "order_id missing in payload" });
  }

  try {
    const tx = await PaymentTransaction.findOne({ orderId });

    // ✅ FIX: If no tx, it's very likely a subscription charge order, so don't 404
    if (!tx) {
      webhookLog.processingMessage =
        "No PaymentTransaction found for orderId (likely subscription payment)";
      webhookLog.responseStatusCode = 200;
      await webhookLog.save();
      return res.json({ success: true, message: "No tx, ignored" });
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
      tx.status = "paid";
      if (!tx.paidAt) tx.paidAt = new Date();
      await tx.save();

      if (tx.brokerId && tx.packageId) {
        const internalReq = {
          body: {
            brokerId: tx.brokerId.toString(),
            packageId: tx.packageId.toString(),
          },
        };

        const internalRes = {
          status(code) {
            this.statusCode = code;
            return this;
          },
          json(payload) {
            console.log(
              "assignLeadPackageToBroker from webhook:",
              this.statusCode || 200,
              payload
            );
          },
        };

        const internalNext = (err) => {
          if (err) console.error("assignLeadPackageToBroker error from webhook:", err);
        };

        await assignLeadPackageToBroker(internalReq, internalRes, internalNext);
      }

      webhookLog.processingMessage = "Payment marked as paid";
      webhookLog.responseStatusCode = 200;
      await webhookLog.save();
      return res.json({ success: true, message: "Payment marked as paid" });
    }

    if (failureEvents.includes(event)) {
      tx.status = "failed";
      await tx.save();

      webhookLog.processingMessage = "Payment marked as failed";
      webhookLog.responseStatusCode = 200;
      await webhookLog.save();
      return res.json({ success: true, message: "Payment marked as failed" });
    }

    await tx.save();
    webhookLog.processingMessage = "Event stored";
    webhookLog.responseStatusCode = 200;
    await webhookLog.save();
    return res.json({ success: true, message: "Event stored" });
  } catch (err) {
    console.error("Webhook handler error", err);
    webhookLog.responseStatusCode = 500;
    webhookLog.processingMessage = "Webhook error";
    webhookLog.error = { message: err.message, stack: err.stack };
    await webhookLog.save();
    return res.status(500).json({ success: false, message: "Webhook error", error: err.message });
  }
};



const STATUS_LABELS = {
  created: 'Pending',
  paid: 'Completed',
  failed: 'Failed',
};

exports.getAllPayments = async (req, res) => {
  try {
    const transactions = await PaymentTransaction.find({})
      .sort({ createdAt: -1 })
      .populate('brokerId', 'name')      // get broker name
      .populate('packageId', 'name key') // get package name and key
      .lean();

    const payments = [];
    let totalAmount = 0;
    let totalPaidAmount = 0;
    let completedCount = 0;
    let pendingCount = 0;
    let failedCount = 0;

    for (const tx of transactions) {
      const broker = tx.brokerId || {};
      const pkg = tx.packageId || {};

      const statusLabel = STATUS_LABELS[tx.status] || 'Pending';

      // amount stats
      totalAmount += tx.amount || 0;
      if (tx.status === 'paid') {
        totalPaidAmount += tx.amount || 0;
        completedCount += 1;
      } else if (tx.status === 'created') {
        pendingCount += 1;
      } else if (tx.status === 'failed') {
        failedCount += 1;
      }

      payments.push({
        id: tx._id,
        invoice: tx.orderId,                // using Razorpay order id as invoice
        broker: broker.name || 'Unknown',
        brokerId: broker._id || null,
        package: pkg.name || 'Unknown',
        packageKey: pkg.key || null,
        amount: tx.amount,
        currency: tx.currency || 'INR',
        date: tx.createdAt,
        status: statusLabel,                // Completed | Pending | Failed
        method: 'Razorpay',                 // no field in model, so constant for now
      });
    }

    return res.json({
      success: true,
      data: payments,
      stats: {
        totalAmount,
        totalPaidAmount,
        completedCount,
        pendingCount,
        failedCount,
      },
    });
  } catch (err) {
    console.error('Error fetching payments', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: err.message,
    });
  }
};

// GET /api/payments/my-subscription/:brokerId
exports.getBrokerSubscription = async (req, res) => {
  try {
    const { brokerId } = req.params;

    const sub = await PaymentSubscription.findOne({ brokerId })
      .sort({ createdAt: -1 })
      .populate("packageId", "name key")
      .lean();

    return res.json({
      success: true,
      data: sub || null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscription",
      error: err.message,
    });
  }
};


// POST /api/payments/cancel-subscription
// body: { brokerId }
exports.cancelBrokerSubscription = async (req, res) => {
  try {
    const { brokerId } = req.body;

    if (!brokerId) {
      return res.status(400).json({ success: false, message: "brokerId is required" });
    }

    const subDoc = await PaymentSubscription.findOne({ brokerId }).sort({ createdAt: -1 });
    if (!subDoc) {
      return res.status(404).json({ success: false, message: "No subscription found" });
    }

    // Cancel on Razorpay (stop future charges)
    const cancelled = await razorpay.subscriptions.cancel(subDoc.razorpaySubscriptionId);

    // Update DB
    subDoc.status = cancelled.status || "cancelled";
    subDoc.rawRazorpayObject = cancelled;
    await subDoc.save();

    return res.json({
      success: true,
      message: "Subscription cancelled",
      data: {
        razorpaySubscriptionId: subDoc.razorpaySubscriptionId,
        status: subDoc.status,
      },
    });
  } catch (err) {
    console.error("cancel subscription error", err);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel subscription",
      error: err.message,
    });
  }
};





// GET /api/payments/my-transactions/:brokerId?type=one_time|subscription|all
exports.getBrokerTransactions = async (req, res) => {
  try {
    const { brokerId } = req.params;
    const type = (req.query.type || "all").toString();

    if (!brokerId) {
      return res.status(400).json({ success: false, message: "brokerId is required" });
    }

    const txs = await PaymentTransaction.find({ brokerId })
      .sort({ createdAt: -1 })
      .populate("packageId", "name key leadsCount price durationLabel")
      .lean();

    const normalize = (tx) => {
      // If you later add fields like subscriptionId/paymentId in schema it will still work
      const isSubscription =
        Boolean(tx.subscriptionId) ||
        Boolean(tx.invoiceId) ||
        Boolean(tx.autoRenew) ||
        Boolean(tx.razorpaySubscriptionId);

      const mode = isSubscription ? "subscription" : "one_time";

      return {
        _id: tx._id,
        mode,
        status: tx.status,
        amount: tx.amount,
        currency: tx.currency || "INR",
        orderId: tx.orderId || null,
        paymentId: tx.paymentId || null,
        invoiceId: tx.invoiceId || null,
        subscriptionId: tx.subscriptionId || null,
        package: tx.packageId
          ? {
              _id: tx.packageId._id,
              name: tx.packageId.name,
              key: tx.packageId.key,
              leadsCount: tx.packageId.leadsCount,
              price: tx.packageId.price,
              durationLabel: tx.packageId.durationLabel,
            }
          : null,
        createdAt: tx.createdAt,
        paidAt: tx.paidAt || null,
      };
    };

    const mapped = txs.map(normalize);

    let filtered = mapped;
    if (type === "one_time") filtered = mapped.filter((t) => t.mode === "one_time");
    if (type === "subscription") filtered = mapped.filter((t) => t.mode === "subscription");

    return res.json({
      success: true,
      data: filtered,
    });
  } catch (err) {
    console.error("getBrokerTransactions error", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: err.message,
    });
  }
};


// GET /api/payments/my-subscription-details/:brokerId
// exports.getBrokerSubscriptionDetails = async (req, res) => {
//   try {
//     const { brokerId } = req.params;

//     if (!brokerId) {
//       return res.status(400).json({ success: false, message: "brokerId is required" });
//     }

//     const sub = await PaymentSubscription.findOne({ brokerId })
//       .sort({ createdAt: -1 })
//       .populate("packageId", "name key leadsCount price durationLabel")
//       .lean();

//     if (!sub) {
//       return res.json({ success: true, data: null });
//     }

//     // Next cycle: use currentCycleEnd if available, else null
//     const nextCycleOn = sub.currentCycleEnd ? sub.currentCycleEnd : null;

//     return res.json({
//       success: true,
//       data: {
//         _id: sub._id,
//         razorpaySubscriptionId: sub.razorpaySubscriptionId,
//         status: sub.status,
//         totalCount: sub.totalCount ?? null,
//         remainingCount: sub.remainingCount ?? null,
//         subscriptionCreatedAt: sub.createdAt,
//         currentCycleStart: sub.currentCycleStart || null,
//         currentCycleEnd: sub.currentCycleEnd || null,
//         nextCycleOn,
//         package: sub.packageId
//           ? {
//               _id: sub.packageId._id,
//               name: sub.packageId.name,
//               key: sub.packageId.key,
//               leadsCount: sub.packageId.leadsCount,
//               price: sub.packageId.price,
//               durationLabel: sub.packageId.durationLabel,
//             }
//           : null,
//       },
//     });
//   } catch (err) {
//     console.error("getBrokerSubscriptionDetails error", err);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch subscription details",
//       error: err.message,
//     });
//   }
// };

exports.getBrokerSubscriptionDetails = async (req, res) => {
  try {
    const { brokerId } = req.params;

    if (!brokerId) {
      return res.status(400).json({ success: false, message: "brokerId is required" });
    }

    const sub = await PaymentSubscription.findOne({ brokerId })
      .sort({ createdAt: -1 })
      .populate("packageId", "name key leadsCount price durationLabel")
      .lean();

    if (!sub) {
      return res.json({ success: true, data: null });
    }

    const nextCycleOn = sub.currentCycleEnd ? sub.currentCycleEnd : null;

    // ✅ only this should count as "Active"
    const effectiveActive = sub.status === "active";

    return res.json({
      success: true,
      data: {
        _id: sub._id,
        razorpaySubscriptionId: sub.razorpaySubscriptionId,
        status: sub.status,
        effectiveActive,
        totalCount: sub.totalCount ?? null,
        remainingCount: sub.remainingCount ?? null,
        subscriptionCreatedAt: sub.createdAt,
        currentCycleStart: sub.currentCycleStart || null,
        currentCycleEnd: sub.currentCycleEnd || null,
        nextCycleOn,
        package: sub.packageId
          ? {
              _id: sub.packageId._id,
              name: sub.packageId.name,
              key: sub.packageId.key,
              leadsCount: sub.packageId.leadsCount,
              price: sub.packageId.price,
              durationLabel: sub.packageId.durationLabel,
            }
          : null,
      },
    });
  } catch (err) {
    console.error("getBrokerSubscriptionDetails error", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscription details",
      error: err.message,
    });
  }
};



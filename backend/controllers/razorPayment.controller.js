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
const { updatePackageHistoryWithPayment } = require('../utils/packageHistoryHelper');

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

      const tx = await PaymentTransaction.create({
        brokerId: broker._id,
        packageId: pkg._id,
        amount: pkg.price,
        currency: 'INR',
        orderId: order.id,
        status: 'created',
        razorpayOrder: order,
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

    // Only assign package if NOT already assigned for this subscription
    // Query broker to check for existing packageHistory entry
    const broker = await Broker.findById(paymentSub.brokerId);
    const existingEntry = broker?.packageHistory?.find(
      entry => entry.subscriptionId?.toString() === paymentSub._id.toString()
    );

    if (existingEntry) {
      console.log(`Package already assigned for subscription ${paymentSub._id}, skipping duplicate`);
      return; // Exit early, don't assign again
    }

    // Get the package details
    const pkg = await LeadPackage.findById(paymentSub.packageId);
    if (!pkg) {
      console.log('Package not found for subscription');
      return;
    }

    // Assign package to broker
    broker.currentPackage = pkg._id;
    broker.currentLeadLimit = pkg.leadsCount;
    broker.packagePurchasedAt = new Date();
    broker.leadsAssigned = 0;

    // Calculate package expiry date
    const durationMatch = pkg.durationLabel?.match(/(\d+)\s*days?/i);
    const durationDays = durationMatch ? parseInt(durationMatch[1], 10) : 30;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + durationDays);
    broker.packageExpiresAt = expiryDate;

    // Create packageHistory entry for subscription (only monthly_subscription, no one_time)
    const packageHistoryEntry = {
      packageId: pkg._id,
      transactionId: null,
      packageType: pkg.name || pkg.key,
      totalLeads: pkg.leadsCount,
      leadsAssigned: 0,
      pendingLeads: 0,
      carriedForwardLeads: 0,
      startDate: new Date(),
      endDate: expiryDate,
      status: 'active',
      isCarryForward: false,
      subscriptionType: 'monthly_subscription',
      subscriptionId: paymentSub._id
    };
    
    broker.packageHistory.push(packageHistoryEntry);
    await broker.save();

    console.log(`✓ Subscription package assigned to broker ${broker._id}: ${pkg.name} (monthly subscription)`);

    // Automatically assign open leads after 30 seconds
    setTimeout(async () => {
      try {
        console.log(`Starting delayed lead assignment for broker ${broker._id} after 30 seconds...`);
        
        const Lead = require('../models/Lead');
        const openLeads = await Lead.find({ 
          status: 'open',
          $or: [
            { assignedTo: null },
            { assignedTo: { $exists: false } }
          ]
        }).lean();

        console.log(`Found ${openLeads.length} open leads to process for broker ${broker._id}`);

        let assignedCount = 0;
        for (const lead of openLeads) {
          try {
            const currentBroker = await Broker.findById(broker._id);
            if (currentBroker.leadsAssigned >= pkg.leadsCount) {
              console.log(`Broker ${broker._id} has reached lead capacity`);
              break;
            }

            const { assignLeadIfPossible } = require('../services/leadAssignmentWatcher');
            await assignLeadIfPossible(lead);
            
            const updatedLead = await Lead.findById(lead._id);
            if (updatedLead && updatedLead.assignedTo && updatedLead.assignedTo.toString() === broker._id.toString()) {
              assignedCount++;
            }
          } catch (err) {
            console.error(`Error assigning lead ${lead._id}:`, err.message);
          }
        }

        console.log(`Successfully assigned ${assignedCount} leads to broker ${broker._id} after 30-second delay`);
      } catch (err) {
        console.error('Error during delayed lead assignment:', err.message);
      }
    }, 30000);
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
        // ✅ FIX: Check if package already assigned for this transaction
        const broker = await Broker.findById(tx.brokerId);
        const existingEntry = broker?.packageHistory?.find(
          entry => entry.transactionId?.toString() === tx._id.toString()
        );

        if (existingEntry) {
          console.log(`✓ Package already assigned for transaction ${tx._id}, skipping duplicate assignment`);
          webhookLog.processingMessage = "Payment marked as paid (already assigned)";
          webhookLog.responseStatusCode = 200;
          await webhookLog.save();
          return res.json({ success: true, message: "Payment marked as paid (already assigned)" });
        }

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
        
        // Update packageHistory with transactionId after creation
        await updatePackageHistoryWithPayment(tx.brokerId.toString(), tx._id.toString(), null);
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

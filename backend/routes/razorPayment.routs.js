


const express = require('express');
const router = express.Router();
const {
  createOrder,
  handleWebhook,
  getAllPayments,
} = require('../controllers/razorPayment.controller');

// create order
router.post('/create-order', createOrder);

// webhook – raw parsing is done in app.js, we only consume it here
router.post(
  '/webhook',
  async (req, res, next) => {
    try {
      console.log('🔔 Webhook route hit');

      // Buffer set in app.js raw middleware
      const raw = req.rawBody;

      if (!raw || !Buffer.isBuffer(raw)) {
        console.error('❌ No raw body received');
        return res.status(400).json({
          success: false,
          message: 'No request body received',
        });
      }

      // Save buffer for signature verification in controller
      req.rawBuffer = raw;

      // Parse JSON once here
      const body = JSON.parse(raw.toString('utf8'));
      req.body = body;

      console.log('✅ Webhook received:', {
        event: body.event,
        orderId:
          body.payload?.order?.entity?.id ||
          body.payload?.payment?.entity?.order_id,
        paymentId: body.payload?.payment?.entity?.id,
      });

      // Optional: ignore Razorpay infra events
      if (body?.event?.startsWith('payment.downtime.')) {
        return res.status(200).json({ received: true });
      }

      return next(); // -> handleWebhook
    } catch (err) {
      console.error('❌ Webhook pre-handler error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal webhook error',
      });
    }
  },
  handleWebhook
);

router.get('/payments-list', getAllPayments);

module.exports = router;

const Broker = require('../models/Broker');
const PaymentTransaction = require('../models/PaymentTransaction');
const PaymentSubscription = require('../models/PaymentSubcription');

/**
 * Update broker's packageHistory with transaction and subscription details
 * Called after a payment is confirmed (from webhook or direct assignment)
 * @param {string} brokerId - Broker's MongoDB ObjectId
 * @param {string} transactionId - PaymentTransaction _id (optional)
 * @param {string} subscriptionId - PaymentSubscription _id (optional, only for subscriptions)
 */
async function updatePackageHistoryWithPayment(brokerId, transactionId = null, subscriptionId = null) {
  try {
    const broker = await Broker.findById(brokerId);
    if (!broker || !broker.packageHistory || broker.packageHistory.length === 0) {
      console.log(`Broker ${brokerId} has no packageHistory to update`);
      return;
    }

    let subscriptionType = 'one_time';
    let packageIdToMatch = null;

    // If we have a transaction ID, get details from PaymentTransaction
    if (transactionId) {
      const transaction = await PaymentTransaction.findById(transactionId).populate('packageId');
      if (!transaction) {
        console.log(`Payment transaction ${transactionId} not found`);
        return;
      }

      // Determine subscription type from transaction
      subscriptionType = transaction.autoRenew ? 'monthly_subscription' : 'one_time';
      packageIdToMatch = transaction.packageId?._id;

      // Find the most recent packageHistory entry for this transaction
      const entryToUpdate = broker.packageHistory
        .slice()
        .reverse()
        .find(entry => 
          (!entry.transactionId || entry.transactionId.toString() === transactionId) &&
          entry.packageId?.toString() === packageIdToMatch?.toString()
        );

      if (entryToUpdate) {
        entryToUpdate.transactionId = transactionId;
        entryToUpdate.subscriptionType = subscriptionType;
        entryToUpdate.subscriptionId = subscriptionId;
        
        await broker.save();
        console.log(`✓ Updated packageHistory for broker ${brokerId}: ${subscriptionType} (tx: ${transactionId})`);
        return;
      }
    }

    // If we have a subscription ID (monthly subscription flow)
    if (subscriptionId) {
      const PaymentSubscription = require('../models/PaymentSubcription');
      const subscription = await PaymentSubscription.findById(subscriptionId).populate('packageId');
      
      if (!subscription) {
        console.log(`Payment subscription ${subscriptionId} not found`);
        return;
      }

      packageIdToMatch = subscription.packageId?._id;
      subscriptionType = 'monthly_subscription';

      // Find the most recent packageHistory entry without subscription info
      const entryToUpdate = broker.packageHistory
        .slice()
        .reverse()
        .find(entry => 
          !entry.subscriptionId &&
          entry.packageId?.toString() === packageIdToMatch?.toString()
        );

      if (entryToUpdate) {
        entryToUpdate.subscriptionType = 'monthly_subscription';
        entryToUpdate.subscriptionId = subscriptionId;
        
        await broker.save();
        console.log(`✓ Updated packageHistory for broker ${brokerId}: monthly_subscription (sub: ${subscriptionId})`);
        return;
      }
    }

    console.log(`No matching packageHistory entry found for broker ${brokerId}`);

  } catch (error) {
    console.error('Error updating packageHistory with payment:', error);
  }
}

module.exports = {
  updatePackageHistoryWithPayment
};

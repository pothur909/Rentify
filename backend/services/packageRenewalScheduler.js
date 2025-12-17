const Broker = require('../models/Broker');
const PaymentTransaction = require('../models/PaymentTransaction');
const LeadPackage = require('../models/LeadPackage');
const { sendPushNotification } = require('./notificationService');

let schedulerInterval = null;

/**
 * Process package renewals and carry-forwards for all brokers
 * Called on the 1st of every month
 */
async function processMonthlyRenewals() {
  try {
    console.log('Starting monthly package renewal process...');
    const now = new Date();

    // Find all brokers with packageHistory
    const brokers = await Broker.find({
      packageHistory: { $exists: true, $ne: [] }
    });

    console.log(`Processing ${brokers.length} brokers for renewal...`);

    for (const broker of brokers) {
      try {
        await processIndividualBrokerRenewal(broker, now);
      } catch (error) {
        console.error(`Error processing renewal for broker ${broker._id}:`, error);
        // Continue with next broker
      }
    }

    console.log('Monthly renewal process completed');
  } catch (error) {
    console.error('Error in processMonthlyRenewals:', error);
  }
}

/**
 * Process renewal for an individual broker
 */
async function processIndividualBrokerRenewal(broker, now) {
  // Find active packages that have expired
  const expiredPackages = broker.packageHistory.filter(pkg => {
    return pkg.status === 'active' && 
           pkg.endDate && 
           new Date(pkg.endDate) < now;
  });

  if (expiredPackages.length === 0) {
    return; // No expired packages for this broker
  }

  console.log(`Found ${expiredPackages.length} expired package(s) for broker ${broker._id}`);

  for (const expiredPkg of expiredPackages) {
    // Calculate unfulfilled leads
    const totalLeads = expiredPkg.totalLeads || 0;
    const leadsAssigned = expiredPkg.leadsAssigned || 0;
    const pendingLeads = Math.max(0, totalLeads - leadsAssigned);

    console.log(`Package ${expiredPkg.transactionId}: ${pendingLeads} unfulfilled leads`);

    // Mark package as expired
    const pkgIndex = broker.packageHistory.findIndex(
      p => p._id.toString() === expiredPkg._id.toString()
    );
    if (pkgIndex !== -1) {
      broker.packageHistory[pkgIndex].status = 'expired';
    }

    // Check if broker has auto-renewal enabled on their latest transaction
    const latestTransaction = await PaymentTransaction.findById(expiredPkg.transactionId);
    
    if (latestTransaction && latestTransaction.autoRenew && pendingLeads > 0) {
      // Create carry-forward entry
      await createCarryForwardEntry(broker, expiredPkg, pendingLeads, now);
      
      // Update expired package status to 'renewed'
      if (pkgIndex !== -1) {
        broker.packageHistory[pkgIndex].status = 'renewed';
      }

      // Send notification to broker
      await sendCarryForwardNotification(broker, pendingLeads, expiredPkg.packageType);
    }
  }

  await broker.save();
}

/**
 * Create a carry-forward entry for unfulfilled leads
 */
async function createCarryForwardEntry(broker, expiredPkg, pendingLeads, now) {
  // Get package details
  const packageDetails = await LeadPackage.findById(expiredPkg.packageId);
  
  if (!packageDetails) {
    console.error(`Package ${expiredPkg.packageId} not found`);
    return;
  }

  // Calculate new end date (add package duration from now)
  const durationMatch = packageDetails.durationLabel?.match(/(\d+)\s*days?/i);
  const durationDays = durationMatch ? parseInt(durationMatch[1], 10) : 30;
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + durationDays);

  // Create carry-forward entry - preserve subscription type from original package
  const carryForwardEntry = {
    packageId: expiredPkg.packageId,
    transactionId: expiredPkg.transactionId,
    packageType: expiredPkg.packageType,
    totalLeads: pendingLeads,  // Only the carried-forward leads
    leadsAssigned: 0,
    pendingLeads: pendingLeads,
    carriedForwardLeads: pendingLeads,
    startDate: now,
    endDate: endDate,
    status: 'active',
    isCarryForward: true,
    originalPackageId: expiredPkg.transactionId,
    subscriptionType: expiredPkg.subscriptionType || 'one_time', // Inherit from original
    subscriptionId: expiredPkg.subscriptionId || null // Inherit from original
  };

  broker.packageHistory.push(carryForwardEntry);

  console.log(`Created carry-forward entry for broker ${broker._id}: ${pendingLeads} leads (${carryForwardEntry.subscriptionType})`);
}

/**
 * Send notification to broker about carry-forward
 */
async function sendCarryForwardNotification(broker, pendingLeads, packageType) {
  if (!broker.fcmTokens || broker.fcmTokens.length === 0) {
    console.log(`Broker ${broker._id} has no FCM tokens, skipping notification`);
    return;
  }

  const title = 'Package Renewed';
  const body = `Your ${packageType || 'package'} has been renewed. ${pendingLeads} lead${pendingLeads > 1 ? 's' : ''} carried forward from last month.`;

  const notificationData = {
    type: 'package_renewal',
    brokerId: broker._id.toString(),
    carriedForwardLeads: pendingLeads.toString(),
    packageType: packageType || ''
  };

  // Send to all broker's devices
  for (const token of broker.fcmTokens) {
    try {
      await sendPushNotification(token, title, body, notificationData);
    } catch (error) {
      console.error(`Failed to send notification to token ${token}:`, error.message);
    }
  }

  console.log(`Sent carry-forward notification to broker ${broker._id}`);
}

/**
 * Start the package renewal scheduler
 * Runs on the 1st of every month at midnight
 */
function startPackageRenewalScheduler() {
  if (schedulerInterval) {
    console.log('Package renewal scheduler is already running');
    return;
  }

  console.log('Starting package renewal scheduler (runs 1st of month at midnight)');

  // Check every hour if it's the 1st day of the month at midnight
  // For more precise scheduling, consider using node-cron
  schedulerInterval = setInterval(() => {
    const now = new Date();
    const dayOfMonth = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Run on 1st day of month at midnight (00:00 to 00:59)
    if (dayOfMonth === 1 && hour === 0 && minute < 60) {
      processMonthlyRenewals();
    }
  }, 60 * 60 * 1000); // Check every hour

  console.log('Package renewal scheduler started successfully');
}

/**
 * Stop the package renewal scheduler
 */
function stopPackageRenewalScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('Package renewal scheduler stopped');
  }
}

module.exports = {
  startPackageRenewalScheduler,
  stopPackageRenewalScheduler,
  processMonthlyRenewals // Export for manual testing
};

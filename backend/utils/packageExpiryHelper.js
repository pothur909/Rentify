const PaymentTransaction = require('../models/PaymentTransaction');

/**
 * Parse duration from durationLabel string
 * @param {string} durationLabel - e.g., "30 days", "7 days"
 * @returns {number} - Number of days
 */
function parseDuration(durationLabel) {
  if (!durationLabel) return 30; // default to 30 days
  
  const match = durationLabel.match(/(\d+)\s*days?/i);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  return 30; // default fallback
}

/**
 * Get all active packages for a broker, sorted by oldest first (FIFO)
 * @param {string} brokerId - Broker's MongoDB ObjectId
 * @returns {Promise<Array>} - Array of PaymentTransaction documents with package details
 */
async function getActivePackagesForBroker(brokerId) {
  const packages = await PaymentTransaction.find({
    brokerId,
    status: 'paid',
    packageStatus: { $in: ['paid', 'expired'] }
  })
    .populate('packageId')
    .sort({ paidAt: 1 }) // oldest first (FIFO)
    .lean();
  
  return packages;
}

/**
 * Find the first available package with remaining capacity
 * Checks expiry and lead count
 * @param {Array} packages - Array of package transactions
 * @returns {Object|null} - Available package or null
 */
function findAvailablePackage(packages) {
  const now = new Date();
  
  for (const pkg of packages) {
    if (!pkg.packageId) continue;
    
    const leadsAssigned = pkg.leadsAssigned || 0;
    const leadsCount = pkg.packageId.leadsCount || 0;
    
    // Check if package has remaining capacity
    if (leadsAssigned < leadsCount) {
      // Package has capacity, return it (even if expired - broker gets all paid leads)
      return pkg;
    }
  }
  
  return null;
}

/**
 * Assign a lead to a package and update its status
 * @param {string} packageTransactionId - PaymentTransaction _id
 * @param {string} leadId - Lead _id (for logging/tracking)
 * @returns {Promise<Object>} - Updated package transaction
 */
async function assignLeadToPackage(packageTransactionId, leadId) {
  const pkg = await PaymentTransaction.findById(packageTransactionId).populate('packageId');
  
  if (!pkg) {
    throw new Error('Package transaction not found');
  }
  
  // Increment leads assigned
  pkg.leadsAssigned = (pkg.leadsAssigned || 0) + 1;
  
  // Check if package is now consumed
  const leadsCount = pkg.packageId?.leadsCount || 0;
  if (pkg.leadsAssigned >= leadsCount) {
    pkg.packageStatus = 'consumed';
  }
  
  // Check if package is expired (but not consumed yet)
  const now = new Date();
  if (pkg.expiresAt && pkg.expiresAt < now && pkg.packageStatus === 'paid') {
    pkg.packageStatus = 'expired';
  }
  
  await pkg.save();
  return pkg;
}

/**
 * Get total remaining leads across all active packages for a broker
 * @param {string} brokerId - Broker's MongoDB ObjectId
 * @returns {Promise<number>} - Total remaining leads
 */
async function getTotalRemainingLeads(brokerId) {
  const packages = await getActivePackagesForBroker(brokerId);
  
  let totalRemaining = 0;
  for (const pkg of packages) {
    if (!pkg.packageId) continue;
    
    const leadsAssigned = pkg.leadsAssigned || 0;
    const leadsCount = pkg.packageId.leadsCount || 0;
    const remaining = Math.max(0, leadsCount - leadsAssigned);
    
    totalRemaining += remaining;
  }
  
  return totalRemaining;
}

module.exports = {
  parseDuration,
  getActivePackagesForBroker,
  findAvailablePackage,
  assignLeadToPackage,
  getTotalRemainingLeads
};

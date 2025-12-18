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
 * Checks both PaymentTransaction and broker.packageHistory
 * @param {string} brokerId - Broker's MongoDB ObjectId
 * @returns {Promise<Array>} - Array of package objects with unified structure
 */
async function getActivePackagesForBroker(brokerId) {
  // First, try to get packages from PaymentTransaction (proper flow)
  const packages = await PaymentTransaction.find({
    brokerId,
    status: 'paid',
    packageStatus: { $in: ['paid', 'expired'] }
  })
    .populate('packageId')
    .sort({ paidAt: 1 }) // oldest first (FIFO)
    .lean();
  
  // If we have PaymentTransaction records, use them
  if (packages.length > 0) {
    return packages;
  }

  // Fallback: If no PaymentTransactions, check broker's packageHistory
  // This handles brokers who got packages via direct assignment
  const Broker = require('../models/Broker');
  const broker = await Broker.findById(brokerId).populate('packageHistory.packageId');
  
  if (!broker || !broker.packageHistory || broker.packageHistory.length === 0) {
    return [];
  }

  // Convert packageHistory entries to PaymentTransaction-like format
  const packageHistoryAsTransactions = broker.packageHistory
    .filter(entry => entry.status === 'active' || entry.status === 'expired')
    .map(entry => ({
      _id: entry._id,
      packageId: entry.packageId,
      leadsAssigned: entry.leadsAssigned || 0,
      totalLeads: entry.totalLeads || 0, // Include totalLeads for capacity checks
      packageStatus: entry.status === 'active' ? 'paid' : 'expired',
      isFromPackageHistory: true, // Flag to identify source
      isCarryForward: entry.isCarryForward || false, // Include carry-forward flag
      expiresAt: entry.endDate,
      paidAt: entry.startDate
    }))
    .sort((a, b) => new Date(a.paidAt) - new Date(b.paidAt)); // oldest first

  console.log(`[getActivePackagesForBroker] Using packageHistory fallback for broker ${brokerId}: ${packageHistoryAsTransactions.length} packages`);
  
  return packageHistoryAsTransactions;
}

/**
 * Find the first available package with remaining capacity
 * Prioritizes carry-forward packages first, then regular packages (FIFO)
 * Checks expiry and lead count
 * @param {Array} packages - Array of package transactions
 * @returns {Object|null} - Available package or null
 */
function findAvailablePackage(packages) {
  const now = new Date();
  
  console.log(`[findAvailablePackage] Evaluating ${packages.length} packages`);
  
  // First pass: look for carry-forward packages with capacity
  for (const pkg of packages) {
    if (!pkg.packageId) {
      console.log(`[findAvailablePackage] Skipping package - no packageId`);
      continue;
    }
    
    const leadsAssigned = pkg.leadsAssigned || 0;
    // For packageHistory-based packages, use totalLeads; for PaymentTransaction, use packageId.leadsCount
    const leadsCount = pkg.totalLeads || pkg.packageId.leadsCount || pkg.packageId?.leadsCount || 0;
    
    console.log(`[findAvailablePackage] Package ${pkg._id}: isCarryForward=${pkg.isCarryForward}, leadsAssigned=${leadsAssigned}, leadsCount=${leadsCount}, isFromPackageHistory=${pkg.isFromPackageHistory}`);
    
    // Check if this is a carry-forward package with remaining capacity
    if (pkg.isCarryForward && leadsAssigned < leadsCount) {
      console.log(`[findAvailablePackage] ✓ Selected carry-forward package ${pkg._id}`);
      return pkg;
    }
  }
  
  // Second pass: look for regular packages with capacity (FIFO)
  for (const pkg of packages) {
    if (!pkg.packageId) continue;
    
    const leadsAssigned = pkg.leadsAssigned || 0;
    // For packageHistory-based packages, use totalLeads; for PaymentTransaction, use packageId.leadsCount
    const leadsCount = pkg.totalLeads || pkg.packageId.leadsCount || pkg.packageId?.leadsCount || 0;
    
    // Check if package has remaining capacity
    if (leadsAssigned < leadsCount) {
      // Package has capacity, return it (even if expired - broker gets all paid leads)
      console.log(`[findAvailablePackage] ✓ Selected regular package ${pkg._id} with capacity ${leadsAssigned}/${leadsCount}`);
      return pkg;
    }
  }
  
  console.log(`[findAvailablePackage] No available package found`);
  return null;
}

/**
 * Assign a lead to a package and update its status
 * @param {string} packageTransactionId - PaymentTransaction _id (or packageHistory entry _id)
 * @param {string} leadId - Lead _id (for logging/tracking)
 * @returns {Promise<Object|null>} - Updated package transaction or null if packageHistory-based
 */
async function assignLeadToPackage(packageTransactionId, leadId) {
  const pkg = await PaymentTransaction.findById(packageTransactionId).populate('packageId');
  
  if (!pkg) {
    // This is likely a packageHistory-based package (e.g., subscription)
    // The packageHistory will be updated separately by updateBrokerPackageHistory
    console.log(`[assignLeadToPackage] No PaymentTransaction found for ${packageTransactionId} - assuming packageHistory-based package`);
    return null;
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
  console.log(`[assignLeadToPackage] Updated PaymentTransaction ${packageTransactionId}: ${pkg.leadsAssigned}/${leadsCount} leads`);
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
    // For packageHistory-based packages, use totalLeads; for PaymentTransaction, use packageId.leadsCount
    const leadsCount = pkg.totalLeads || pkg.packageId.leadsCount || pkg.packageId?.leadsCount || 0;
    const remaining = Math.max(0, leadsCount - leadsAssigned);
    
    totalRemaining += remaining;
  }
  
  return totalRemaining;
}

/**
 * Check if a specific package still has capacity (with fresh DB data)
 * This is critical to prevent race conditions during lead assignment
 * @param {string} brokerId - Broker's MongoDB ObjectId
 * @param {string} packageRefId - Package reference ID (either PaymentTransaction _id or packageHistory entry _id)
 * @returns {Promise<boolean>} - True if package has capacity, false otherwise
 */
async function checkPackageCapacity(brokerId, packageRefId) {
  const Broker = require('../models/Broker');
  
  console.log(`[checkPackageCapacity] Checking capacity for broker ${brokerId}, packageRefId: ${packageRefId}`);
  
  // Fetch fresh broker data from DB to avoid stale data issues
  const broker = await Broker.findById(brokerId);
  if (!broker || !broker.packageHistory || broker.packageHistory.length === 0) {
    console.log(`[checkPackageCapacity] No broker or packageHistory found for ${brokerId}`);
    return false;
  }

  console.log(`[checkPackageCapacity] Broker has ${broker.packageHistory.length} packageHistory entries:`);
  broker.packageHistory.forEach((entry, i) => {
    console.log(`  [${i}] _id: ${entry._id}, transactionId: ${entry.transactionId}, status: ${entry.status}, leadsAssigned: ${entry.leadsAssigned}/${entry.totalLeads}`);
  });

  // Find the specific packageHistory entry using the same matching logic
  let historyEntry = null;
  const refIdStr = packageRefId?.toString();
  
  // Try to match by packageHistory entry _id (for subscription packages)
  historyEntry = broker.packageHistory.find(
    entry => entry._id && entry._id.toString() === refIdStr
  );
  
  if (historyEntry) {
    console.log(`[checkPackageCapacity] ✓ Found by _id match`);
  }
  
  // If not found, try matching by transactionId (for PaymentTransaction packages)
  if (!historyEntry) {
    historyEntry = broker.packageHistory.find(
      entry => entry.transactionId && entry.transactionId.toString() === refIdStr
    );
    if (historyEntry) {
      console.log(`[checkPackageCapacity] ✓ Found by transactionId match`);
    }
  }
  
  // If still not found, try to find ANY active package with capacity (fallback)
  if (!historyEntry) {
    console.log(`[checkPackageCapacity] ✗ No match by _id or transactionId for refId ${refIdStr}`);
    
    // Fallback: find any active package with capacity
    historyEntry = broker.packageHistory.find(
      entry => entry.status === 'active' && (entry.leadsAssigned || 0) < (entry.totalLeads || 0)
    );
    
    if (historyEntry) {
      console.log(`[checkPackageCapacity] ⚠ Using fallback - found active package with capacity: ${historyEntry._id}`);
    }
  }
  
  if (!historyEntry) {
    console.log(`[checkPackageCapacity] ❌ No matching packageHistory entry found for refId ${packageRefId}`);
    return false;
  }
  
  // Check if package has remaining capacity
  const leadsAssigned = historyEntry.leadsAssigned || 0;
  const totalLeads = historyEntry.totalLeads || 0;
  const hasCapacity = leadsAssigned < totalLeads;
  
  console.log(`[checkPackageCapacity] Package ${historyEntry._id}: ${leadsAssigned}/${totalLeads} leads, hasCapacity: ${hasCapacity}`);
  
  return hasCapacity;
}

module.exports = {
  parseDuration,
  getActivePackagesForBroker,
  findAvailablePackage,
  assignLeadToPackage,
  getTotalRemainingLeads,
  checkPackageCapacity
};

/**
 * Update broker's packageHistory when a lead is assigned
 * Keeps packageHistory in sync with PaymentTransaction
 * @param {string} brokerId - Broker's MongoDB ObjectId
 * @param {string} packageTransactionId - PaymentTransaction _id (can be null)
 * @param {string} packageId - LeadPackage _id (optional, for fallback matching)
 * @returns {Promise<void>}
 */
async function updateBrokerPackageHistory(brokerId, packageRefId, packageId = null) {
  const Broker = require('../models/Broker');
  
  console.log(`[packageHistory] Updating for broker ${brokerId}, refId: ${packageRefId}, pkgId: ${packageId}`);
  
  const broker = await Broker.findById(brokerId);
  if (!broker || !broker.packageHistory || broker.packageHistory.length === 0) {
    console.log(`[packageHistory] No broker or packageHistory found`);
    return;
  }

  console.log(` [packageHistory] Found ${broker.packageHistory.length} package entries`);

  // Find the matching packageHistory entry
  // Strategy: Try multiple matching approaches in order of preference
  
  // Convert packageRefId to string for consistent comparison
  const refIdStr = packageRefId?.toString();
  
  // 1. Try to match by packageHistory entry _id directly (for subscription/packageHistory-based packages)
  let historyEntry = broker.packageHistory.find(
    entry => entry._id && entry._id.toString() === refIdStr
  );
  
  if (historyEntry) {
    console.log(`[packageHistory] ✓ Match by entry _id: ${historyEntry._id}`);
  } else {
    console.log(`[packageHistory] ✗ Match by entry _id: NOT FOUND`);
  }

  // 2. Try to match by transactionId (for PaymentTransaction-based packages)
  if (!historyEntry && packageRefId) {
    historyEntry = broker.packageHistory.find(
      entry => entry.transactionId && entry.transactionId.toString() === refIdStr
    );
    
    if (historyEntry) {
      console.log(`[packageHistory] ✓ Match by transactionId: ${historyEntry.transactionId}`);
    } else {
      console.log(`[packageHistory] ✗ Match by transactionId: NOT FOUND`);
    }
  }

  // 3. If no match by IDs and we have packageId, match by packageId + active status
  if (!historyEntry && packageId) {
    const pkgIdStr = packageId.toString();
    historyEntry = broker.packageHistory.find(
      entry => 
        entry.packageId?.toString() === pkgIdStr &&
        entry.status === 'active' && 
        (entry.leadsAssigned || 0) < (entry.totalLeads || 0)
    );
    
    if (historyEntry) {
      console.log(`[packageHistory] ✓ Match by packageId: ${pkgIdStr}`);
    } else {
      console.log(`[packageHistory] ✗ Match by packageId: NOT FOUND`);
    }
  }

  // 4. Fallback: Find first active package with capacity (for backward compatibility)
  // NOTE: This should rarely be used and might indicate a configuration issue
  if (!historyEntry) {
    historyEntry = broker.packageHistory.find(
      entry => entry.status === 'active' && (entry.leadsAssigned || 0) < (entry.totalLeads || 0)
    );
    
    if (historyEntry) {
      console.log(`[packageHistory] ⚠ Match by active+capacity (fallback): ${historyEntry._id}`);
    } else {
      console.log(`[packageHistory] ✗ Match by active+capacity: NOT FOUND`);
    }
  }

  if (!historyEntry) {
    console.log(`[packageHistory] ❌ No available packageHistory entry found for broker ${brokerId}`);
    return;
  }

  console.log(`[packageHistory] Selected entry: ${historyEntry.packageType}, current: ${historyEntry.leadsAssigned}/${historyEntry.totalLeads}`);

  // Use atomic update to prevent race conditions
  // When multiple leads are assigned simultaneously, we need to ensure each increment is atomic
  const historyEntryId = historyEntry._id;
  const totalLeads = historyEntry.totalLeads || 0;
  const isCarryForward = historyEntry.isCarryForward || false;
  
  // Build atomic update operations
  const updateOps = {
    $inc: {
      'packageHistory.$.leadsAssigned': 1
    }
  };
  
  // Calculate pendingLeads based on package type
  if (!isCarryForward) {
    // For regular packages: pending = totalLeads - (leadsAssigned + 1)
    const newPendingLeads = Math.max(0, totalLeads - (historyEntry.leadsAssigned + 1));
    updateOps.$set = {
      'packageHistory.$.pendingLeads': newPendingLeads
    };
    
    // Check if package will be consumed after this increment
    if ((historyEntry.leadsAssigned + 1) >= totalLeads) {
      updateOps.$set['packageHistory.$.status'] = 'consumed';
    }
  } else {
    // For carry-forward packages: decrement pendingLeads
    updateOps.$inc['packageHistory.$.pendingLeads'] = -1;
  }
  
  // Perform atomic update
  await Broker.updateOne(
    { 
      _id: brokerId,
      'packageHistory._id': historyEntryId
    },
    updateOps
  );
  
  console.log(`✓ [packageHistory] Atomically updated for broker ${brokerId}: ${historyEntry.packageType} (${historyEntry.leadsAssigned + 1}/${totalLeads})`);
}

module.exports = {
  parseDuration,
  getActivePackagesForBroker,
  findAvailablePackage,
  assignLeadToPackage,
  getTotalRemainingLeads,
  checkPackageCapacity,
  updateBrokerPackageHistory
};


/**
 * Manually trigger stale lead reassignment check
 * POST /api/leads/check-stale
 */
exports.checkStaleLeads = async (req, res, next) => {
  try {
    const { checkAndReassignStaleLeads } = require('../services/staleLeadReassignment');
    
    const result = await checkAndReassignStaleLeads();
    
    return res.json({
      message: 'Stale lead check completed',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

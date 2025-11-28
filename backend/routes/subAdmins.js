var express = require('express');
var router = express.Router();
const {
  loginSubAdmin,
  getSubAdminProfile,
  createSubAdmin,
  getAllSubAdmins,
  getSubAdminById,
  updateSubAdmin,
  deleteSubAdmin,
  assignLeadsToSubAdmin,
  removeLeadsFromSubAdmin,
  getSubAdminLeads,
  assignBrokersToSubAdmin,
  removeBrokersFromSubAdmin,
  getSubAdminBrokers,
  getSubAdminDashboard
} = require('../controllers/subAdminController');

// Authentication (Public)
router.post('/login', loginSubAdmin);

// Sub-Admin Profile
router.get('/profile', getSubAdminProfile);

// Sub-Admin Management (Admin Only)
router.post('/', createSubAdmin);
router.get('/', getAllSubAdmins);
router.get('/:subAdminId', getSubAdminById);
router.put('/:subAdminId', updateSubAdmin);
router.delete('/:subAdminId', deleteSubAdmin);

// Lead Assignments (Admin Only)
router.post('/:subAdminId/assign-leads', assignLeadsToSubAdmin);
router.post('/:subAdminId/remove-leads', removeLeadsFromSubAdmin);
router.get('/:subAdminId/leads', getSubAdminLeads);

// Broker Assignments (Admin Only)
router.post('/:subAdminId/assign-brokers', assignBrokersToSubAdmin);
router.post('/:subAdminId/remove-brokers', removeBrokersFromSubAdmin);
router.get('/:subAdminId/brokers', getSubAdminBrokers);

// Dashboard
router.get('/:subAdminId/dashboard', getSubAdminDashboard);

module.exports = router;

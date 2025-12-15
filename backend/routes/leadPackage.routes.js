// // routes/leadPackage.routes.js

const express = require('express');
const router = express.Router();
const {
  getAllLeadPackages,
  getLeadPackageByKey,
  getLeadPackageById,
  createLeadPackage,
  createLeadPackagesBulk,
  seedLeadPackages,
  updateLeadPackage,
  deleteLeadPackage,
   createRazorpayPlanForPackage,
} = require('../controllers/leadPackage.controller');

// list active packages
router.get('/', getAllLeadPackages);

// get by key (for frontend + order creation)
router.get('/key/:key', getLeadPackageByKey);

// get by id (for admin UI)
router.get('/:id', getLeadPackageById);

// single create
router.post('/', createLeadPackage);

// bulk insert (pure create)
router.post('/bulk', createLeadPackagesBulk);

// upsert by key (for initial seeding / updates)
router.post('/seed', seedLeadPackages);

// update by id
router.put('/:id', updateLeadPackage);

// soft delete
router.delete('/:id', deleteLeadPackage);

router.post('/:id/create-plan', createRazorpayPlanForPackage);


module.exports = router;

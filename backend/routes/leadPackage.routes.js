// // routes/leadPackage.routes.js
// const express = require('express');
// const router = express.Router();
// const {
//   getAllLeadPackages,
//   getLeadPackageByKey,
//   createLeadPackage,
//   seedLeadPackages,
// } = require('../controllers/leadPackage.controller');

// // Get all active packages
// router.get('/', getAllLeadPackages);

// // Get a single package by key
// router.get('/:key', getLeadPackageByKey);

// // Create a single package
// router.post('/', createLeadPackage);

// // Seed multiple packages at once
// router.post('/seed', seedLeadPackages);

// module.exports = router;


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

module.exports = router;

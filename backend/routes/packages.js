var express = require('express');
var router = express.Router();
const { 
  getAllPackages, 
  createPackage, 
  updatePackage, 
  deletePackage,
  assignPackageToBroker,
  assignLeadPackageToBroker
} = require('../controllers/packagesController');

// Get all active packages
router.get('/', getAllPackages);

// Create new package (admin)
router.post('/', createPackage);

// Update package (admin)
router.put('/:id', updatePackage);

// Delete (deactivate) package (admin)
router.delete('/:id', deletePackage);

// Assign package to broker
// router.post('/assign', assignPackageToBroker);
router.post('/assign', assignLeadPackageToBroker);

module.exports = router;

var express = require('express');
var router = express.Router();
const { createLead, addRemark, updateStatus, revealContactDetails, getAllLeadsForAdmin, assignOpenLeadsToBroker, reassignLeadsToAnotherBroker, bulkCreateLeads } = require('../controllers/leadsController');
const multer = require('multer');
const upload = multer(); // uses memory storage

router.get('/admin/all', getAllLeadsForAdmin);
router.post('/', createLead);
router.put('/:leadId/remark', addRemark);
router.put('/:leadId/status', updateStatus);
router.put('/:leadId/reveal', revealContactDetails);
router.post('/assign-to-broker', assignOpenLeadsToBroker);
router.post('/reassign-leads', reassignLeadsToAnotherBroker);

router.post(
  '/bulk-upload',
  upload.single('file'),
 bulkCreateLeads
);

module.exports = router;

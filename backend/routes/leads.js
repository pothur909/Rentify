var express = require('express');
var router = express.Router();
const { createLead, addRemark, updateStatus, revealContactDetails, getAllLeadsForAdmin } = require('../controllers/leadsController');

router.get('/admin/all', getAllLeadsForAdmin);
router.post('/', createLead);
router.put('/:leadId/remark', addRemark);
router.put('/:leadId/status', updateStatus);
router.put('/:leadId/reveal', revealContactDetails);

module.exports = router;

var express = require('express');
var router = express.Router();
const { createLead } = require('../controllers/leadsController');

router.post('/', createLead);

module.exports = router;

'use strict'

const express = require('express');
const MailerController = require('../controllers/mailer');
const router = express.Router();

router.post('/send-mail', MailerController.sendMailcito);

module.exports = router;
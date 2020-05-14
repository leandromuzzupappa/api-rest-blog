'use strict'

const express = require('express');
const NewsletterController = require('../controllers/newsletter');

const router = express.Router();

router.post('/save', NewsletterController.save);
router.get('/get-emails/:last?', NewsletterController.getEmails);
router.delete('/delete-email/:id', NewsletterController.delete);
router.get('/search-email/:search', NewsletterController.search);


module.exports = router;
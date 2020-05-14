'use strict'

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const NewsletterSchema = Schema({
    email: { type: String, unique: true, index: true, sparse: true }
});

NewsletterSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Newsletter', NewsletterSchema);
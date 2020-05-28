'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eMailerSchema = Schema({
    nombre: String,
    email: String,
    mensaje: String
})

module.exports = mongoose.model('eMailer', eMailerSchema);
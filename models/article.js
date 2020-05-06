'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = Schema({
    // id, titulo, copete, contenido, categoria/ categoria id?, imagen, fecha, status, usuario id 
    // pendiente: ver como relacionar otros modelos entre si

    title: String,
    brief: String,
    content: String,
    category: String,
    image: String,
    status: Boolean,
    date: {
        type: Date,
        default: Date.now
    },
    author: String


});

module.exports = mongoose.model('Article', ArticleSchema);
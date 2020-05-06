'use strict'

const express = require('express');
const ArticleController = require('../controllers/article');
const multiparty = require('connect-multiparty');

const mdUpload = multiparty({
    uploadDir: './upload/articles'
});

const router = express.Router();


// Rutas de prueba
router.get('/test-de-controlador', ArticleController.test);
router.post('/datos-autor', ArticleController.datosAutor);

// Rutas para articulos
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id', mdUpload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);



module.exports = router;
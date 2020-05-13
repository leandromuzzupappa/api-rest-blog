'use strict'

const express = require('express');
const CategoryController = require('../controllers/category');
const multiparty = require('connect-multiparty');

const mdUpload = multiparty({
    uploadDir: './upload/categories'
});

const router = express.Router();

router.post('/create-category', CategoryController.save);
router.get('/categories/:last?', CategoryController.getCategories);
router.get('/category/:id', CategoryController.getCategory);
router.put('/category/:id', CategoryController.update);
router.delete('/category/:id', CategoryController.delete);
router.post('/category-upload-image/:id', mdUpload, CategoryController.upload);

router.get('/category-get-image/:image', CategoryController.getImage);
router.get('/category-search/:search', CategoryController.search);


module.exports = router;
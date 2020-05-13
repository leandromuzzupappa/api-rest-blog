'use strict'

const validator = require('validator');
const Category = require('../models/category');
const fs = require('fs');
const path = require('path');

const controller = {
    save: (req, res) => {
        // Traer parametros por post
        const params = req.body;
        let validateName;

        // Validar datos
        try {
            validateName = !validator.isEmpty(params.name);

        } catch (err) {
            return res.status(400).send({
                status: 'error',
                message: 'Faltan datos por enviar.'
            })
        }
        if (validateName) {
            // Crear el objeto a guardar
            const category = new Category();

            // Asignar valores
            category.name = params.name;
            category.image = null;

            // Guardar el articulo
            category.save((err, categoryStored) => {
                if (err || !categoryStored) {
                    return res.status(400).send({
                        status: 'error',
                        message: 'La categoria no pudo ser procesada.'
                    });
                }

                // Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: categoryStored
                })
            })
        } else {
            return res.status(400).send({
                status: 'error',
                message: 'No se pudo validar los datos.'
            })
        }
    },

    getCategories: (req, res) => {
        let query = Category.find({});
        let last = req.params.last;

        if (last || last != undefined) {
            query.limit(parseInt(last));
        }

        // Find
        query.sort('-_id').exec((err, categories) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Hubo un error al traer las categorias.' + err
                })
            }
            if (!categories || categories == 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se han encontrado categorias.'
                })
            }
            return res.status(200).send({
                status: 'success',
                categories
            });
        });
    },
    getCategory: (req, res) => {
        const categoryId = req.params.id;

        if (!categoryId || categoryId == null) {
            return res.status(400).send({
                status: 'error',
                message: 'No se ha encontrado el ID o el ID es nulo.'
            })
        }

        // buscar categoria
        Category.findById(categoryId, (err, category) => {
            if (err || !category) {
                return res.status(204).send({
                    status: 'error',
                    message: 'No se encontró la categoria o la categoria no existe.'
                })
            }

            // devolver un resultado
            return res.status(200).send({
                status: 'success',
                category
            })
        })

    },

    update: (req, res) => {
        const categoryId = req.params.id;
        const params = req.body;

        let validateName;
        // Validar datos
        try {
            validateName = !validator.isEmpty(params.name);

        } catch (err) {
            return res.status(400).send({
                status: 'error',
                message: 'Faltan datos por enviar.'
            })
        }

        if (validateName) {

            // Si es valido -> finoneandupdate()
            Category.findOneAndUpdate({
                _id: categoryId
            }, params, {
                new: true
            }, (err, categoryUpdated) => {
                if (err) {
                    return res.status(400).send({
                        status: 'error',
                        message: 'No se puede actualizar la categoria. ' + err
                    })
                }
                if (!categoryUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe la categoria.'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    category: categoryUpdated
                })

            });

        } else {
            return res.status(400).send({
                status: 'error',
                message: 'No se pudo validar los datos.'
            })
        }
    },
    delete: (req, res) => {
        const categoryId = req.params.id;

        Article.findOneAndDelete({
            _id: categoryId
        }, (err, categoryRemoved) => {
            if (err) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Hubo un error al borrar la categoria.'
                })
            }
            if (!categoryRemoved) {
                return res.status(500).send({
                    status: 'error',
                    message: 'No se encontro categoria para borrar'
                })
            }

            return res.status(200).send({
                status: 'success',
                category: categoryRemoved
            })
        })
    },
    upload: (req, res) => {
        let fileName = 'Imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: 'No se ha seleccionado ninguna imagen para subir'
            })
        }

        // traer el nombre y la extension
        let filePath = req.files.file0.path;
        const fileSplit = filePath.split('/')

        // Le asigno el nombre del archivo
        fileName = fileSplit[2];

        // extension del archivo
        let extensionSplit = fileName.split('.');
        const fileExt = extensionSplit[1];

        // comprobar la extension -> imagenes
        if (fileExt != 'png' && fileExt != 'jpg' && fileExt != 'jpeg' && fileExt != 'gif') {
            // Si no es valida la extension borrar archivo
            fs.unlink(filePath, (err) => {
                return res.status(400).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida.'
                })
            });

        } else {
            const categoryId = req.params.id;
            Category.findOneAndUpdate({
                _id: categoryId
            }, {
                image: fileName
            }, {
                new: true
            }, (err, categoryUpdated) => {
                if (err || !categoryUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Hubo un error al borrar el archivo.'
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    category: categoryUpdated
                })
            });
        }
    },

    getImage: (req, res) => {
        const file = req.params.image;
        const filePath = './upload/categories/' + file;

        fs.exists(filePath, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(filePath));

            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe.'
                })
            }
        })
    },
    search: (req, res) => {
        // string abuscar
        const searchString = req.params.search;

        // find or
        Category.find({
                $or: [{
                    "name": {
                        "$regex": searchString,
                        "$options": "i"
                    }
                }, ]
            })
            .sort([
                ['date', 'descending']
            ])
            .exec((err, categories) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticion' + err
                    })
                }
                if (!categories || categories.length <= 0) {
                    return res.status(204).send({
                        status: 'error',
                        message: 'No hay categorias que coincidan con la busqueda',
                        categories
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    categories
                })
            })
    }
}

module.exports = controller;
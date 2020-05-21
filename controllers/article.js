'use stict'

const validator = require('validator');
const Article = require('../models/article');
const fs = require('fs');
const path = require('path');


const controller = {

    datosAutor: (req, res) => {
        return res.status(200).send({
            nombre: 'Leandro Muzzupappa',
            web: 'leandromuzzupappa.github.io',
            email: 'lnmuzzupappa@gmail.com'
        })
    },
    test: (req, res) => {
        return res.status(200).send({
            message: 'Esta es una respuesta del metodo test del controlador'
        })
    },

    save: (req, res) => {
        // Traer parametros por post
        const params = req.body;
        let validateTitle, validateBrief, validateContent, validateCategory, validateStatus, validateFeatured, validateAuthor;

        // Validar datos
        try {
            validateTitle = !validator.isEmpty(params.title);
            validateBrief = !validator.isEmpty(params.brief);
            validateContent = !validator.isEmpty(params.content);
            validateCategory = !validator.isEmpty(params.category);
            validateStatus = !validator.isEmpty(params.status);
            validateFeatured = !validator.isEmpty(params.featured);
            validateAuthor = !validator.isEmpty(params.author);

        } catch (err) {
            return res.status(400).send({
                status: 'error',
                message: 'Faltan datos por enviar.'
            })
        }
        if (validateTitle && validateBrief && validateContent && validateCategory && validateStatus && validateFeatured && validateAuthor) {
            // Crear el objeto a guardar
            const article = new Article();

            // Asignar valores
            article.title = params.title;
            article.brief = params.brief;
            article.content = params.content;
            article.category = params.category;
            article.image = null;
            article.status = params.status;
            article.featured = params.featured;
            article.author = params.author;

            // Guardar el articulo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(400).send({
                        status: 'error',
                        message: 'El articulo no pudo ser procesado.'
                    });
                }

                // Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                })
            })
        } else {
            return res.status(400).send({
                status: 'error',
                message: 'No se pudo validar los datos.'
            })
        }
    },

    // traer todos los articulos, o los que quiera
    getArticles: (req, res) => {

        let query = Article.find({});

        // Si existe last?
        let last = req.params.last;
        if (last || last != undefined) {
            query.limit(parseInt(last));
        }

        // Find
        query.sort('-_id').exec((err, articles) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Hubo un error al traer los articulos.' + err
                })
            }
            if (!articles || articles == 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se han encontrado articulos.'
                })
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
        });


    },

    getArticle: (req, res) => {
        // traer el id de la url
        const articleId = req.params.id;

        // comprobar que existe 
        if (!articleId || articleId == null) {
            return res.status(400).send({
                status: 'error',
                message: 'No se ha encontrado el ID o el ID es nulo.'
            })
        }

        // buscar el articulo
        Article.findById(articleId, (err, article) => {
            // error o esta mal el id - 404
            if (err || !article) {
                return res.status(204).send({
                    status: 'error',
                    message: 'No se encontró el articulo o el articulo no existe.'
                })
            }

            // devolver un resultado
            return res.status(200).send({
                status: 'success',
                article
            })
        })
    },

    update: (req, res) => {
        // traer el id de la url
        const articleId = req.params.id;

        // traer los datos que llegan por put
        const params = req.body;

        // Validar los datos
        let validateTitle, validateBrief, validateContent, validateCategory, validateStatus, validateFeatured, validateAuthor;
        // Validar datos
        try {
            validateTitle = !validator.isEmpty(params.title);
            validateBrief = !validator.isEmpty(params.brief);
            validateContent = !validator.isEmpty(params.content);
            validateCategory = !validator.isEmpty(params.category);
            validateStatus = !validator.isEmpty(params.status);
            validateFeatured = !validator.isEmpty(params.featured);
            validateAuthor = !validator.isEmpty(params.author);

        } catch (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Faltan datos por enviar.' + err
            })
        }

        if (validateTitle && validateBrief && validateContent && validateCategory && validateStatus && validateFeatured && validateAuthor) {

            // Si es valido -> finoneandupdate()
            Article.findOneAndUpdate({
                _id: articleId
            }, params, {
                new: true
            }, (err, articleUpdated) => {
                if (err) {
                    return res.status(400).send({
                        status: 'error',
                        message: 'No se puede actualizar el articulo. ' + err
                    })
                }
                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo.'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                })

            });

        } else {
            return res.status(400).send({
                status: 'error',
                message: 'No se pudo validar los datos.' + err
            })
        }
    },

    delete: (req, res) => {
        // traer el id de la url
        const articleId = req.params.id;

        // find and delete
        Article.findOneAndDelete({
            _id: articleId
        }, (err, articleRemoved) => {
            if (err) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Hubo un error al borrar el articulo.'
                })
            }
            if (!articleRemoved) {
                return res.status(500).send({
                    status: 'error',
                    message: 'No se encontro articulo para borrar'
                })
            }

            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            })
        })
    },

    upload: (req, res) => {
        // configurara el modulo de connect multiparty en el router
        // el key a subir se tiene que llamar file0

        // trare el archivo
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
            // Si se valida todo buscara rticulo, asignar imagen y actualizar
            const articleId = req.params.id;
            Article.findOneAndUpdate({
                _id: articleId
            }, {
                image: fileName
            }, {
                new: true
            }, (err, articleUpdated) => {
                if (err || !articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Hubo un error al borrar el archivo.'
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                })
            });
        }
    },

    getImage: (req, res) => {
        const file = req.params.image;
        const filePath = './upload/articles/' + file;

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
        Article.find({
                $or: [{
                        "title": {
                            "$regex": searchString,
                            "$options": "i"
                        }
                    },
                    {
                        "brief": {
                            "$regex": searchString,
                            "$options": "i"
                        }
                    },
                    {
                        "content": {
                            "$regex": searchString,
                            "$options": "i"
                        }
                    },
                    {
                        "category": {
                            "$regex": searchString,
                            "$options": "i"
                        }
                    }
                ]
            })
            .sort([
                ['date', 'descending']
            ])
            .exec((err, articles) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticion' + err
                    })
                }
                if (!articles || articles.length <= 0) {
                    return res.status(204).send({
                        status: 'error',
                        message: 'No hay articulos que coincidan con la busqueda',
                        articles
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    articles
                })
            })
    }


};

module.exports = controller;
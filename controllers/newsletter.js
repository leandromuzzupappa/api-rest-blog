'use strict'

const validator = require('validator');
const Newsletter = require('../models/newsletter');

const controller = {

    save: (req, res) => {
        // Traer parametros por post
        const params = req.body;
        let validateEmail;

        // Validar datos
        try {
            validateEmail = !validator.isEmpty(params.email);

        } catch (err) {
            return res.status(400).send({
                status: 'error',
                message: 'Faltan datos por enviar.'
            })
        }
        if (validateEmail) {
            // Crear el objeto a guardar
            const newsletter = new Newsletter();

            // Asignar valores
            newsletter.email = params.email;

            // Guardar el articulo
            newsletter.save((err, newsletterStored) => {
                if (err || !newsletterStored) {
                    return res.status(400).send({
                        status: 'error',
                        message: 'El mail no pudo ser procesado.' + err
                    });
                }

                // Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    newsletter: newsletterStored
                })
            })
        } else {
            return res.status(400).send({
                status: 'error',
                message: 'No se pudo validar los datos.'
            })
        }
    },

    getEmails: (req, res) => {
        let query = Newsletter.find({});
        let last = req.params.last;

        if (last || last != undefined) {
            query.limit(parseInt(last));
        }

        // Find
        query.sort('-_id').exec((err, newsletter) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Hubo un error al traer los emails.' + err
                })
            }
            if (!newsletter || newsletter == 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se han encontrado emails.'
                })
            }
            return res.status(200).send({
                status: 'success',
                newsletter
            });
        });
    },

    delete: (req, res) => {
        const emailSearched = req.params.id;
        

        Newsletter.findOneAndDelete({
            email: emailSearched
        }, (err, emailRemoved) => {
            if (err) {
                return res.status(400).send({
                    status: 'error',
                    message: 'Hubo un error al borrar el email.' + err
                })
            }
            if (!emailRemoved) {
                return res.status(500).send({
                    status: 'error',
                    message: 'No se encontro email para borrar'
                })
            }

            return res.status(200).send({
                status: 'success',
                message: 'El correo electronico fue borrado correctamente.',
                newsletter: emailRemoved
            })
        })
    },

    search: (req, res) => {
        // string abuscar
        const searchString = req.params.search;

        // find or
        Newsletter.find({
                $or: [{
                    "email": {
                        "$regex": searchString,
                        "$options": "i"
                    }
                }, ]
            })
            .exec((err, emails) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la peticion' + err
                    })
                }
                if (!emails || emails.length <= 0) {
                    return res.status(204).send({
                        status: 'error',
                        message: 'No hay emails que coincidan con la busqueda'
                    })
                }

                return res.status(200).send({
                    status: 'success',
                    emails
                })
            })
            
    },

}

module.exports = controller;
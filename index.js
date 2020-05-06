'use strict'
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

//mongoose.connect(url, opciones).then( ()=>{})
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/api_rest_blog', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('La conexion ha sido correcta');

        // Crear servidor y excuchar peticiones HTTP
        app.listen(port, () => {
            console.log('Servidor corriendo en http://localhost' + port);

        });
    })
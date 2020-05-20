'use strict'

// Cargar modulos de node para crear servidor
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

// Ejecutar express (http)

// Cargar rutas
const ArticleRoutes = require('./routes/article');
const CategoryRoutes = require('./routes/category');
const NewsletterRoutes = require('./routes/newsletter');

// Middlewares
app.use(bodyparser.urlencoded({
    extended: false
}));
app.use(bodyparser.json({limit: '30mb'}));


// CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// Añadir prefijos a rutas / cargar rutas
app.use('/api', ArticleRoutes);
app.use('/api', CategoryRoutes);
app.use('/api/newsletter', NewsletterRoutes);



// Exportar modulo (this file)
module.exports = app;
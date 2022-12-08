/**
 * -----------------------
 * Point d'entrée de l'API
 * -----------------------
 */

// Importe Express et créer une nouvelle instance de l'API
const express = require('express');
const api = express(); // application Express

// On ajoute le middleware express.json() qui interceptera toutes les requêtes avec un Content-Type = "application/json"
// pour les parser et les ajouter dans l'objet request en tant que propriété "body"
api.use(express.json());

// Construction des entêtes HTTP
api.use((request, response, next) => {

    response.setHeader('Access-Control-Allow-Origin', '*'); // TODO:gestion du CORS
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    next();

});

// Importation des routers
const authRouter = require('./routes/auth');
const saucesRouter = require('./routes/sauces');

api.use('/api/auth', authRouter);
api.use('/api/sauces', saucesRouter);

// Permet de charger les images depuis le front en routant l'URL "/images" vers le dossier statique "images"
api.use('/images', express.static('images'));

module.exports = api;
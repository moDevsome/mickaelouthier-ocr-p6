/**
 * Point d'entrée de l'API
 */

// Importe Express et créer une nouvelle instance de l'application
const express = require('express');
const api = express(); // application Express

api.get('/', (req, res) => {

    res.write('Hello les gens, API dispo !!');
    res.end();
});

 module.exports = api;
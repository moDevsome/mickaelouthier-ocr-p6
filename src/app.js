/**
 * Point d'entrée de l'API
 */

// Importe Express et créer une nouvelle instance de l'application
const express = require('express');
const app = express(); // application Express

app.get('/', (req, res) => {
    res.write('Work in Progress');
    res.end();
});

 module.exports = app;
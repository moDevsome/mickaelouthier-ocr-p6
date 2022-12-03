/**
 * ------------------------------------------------------
 * Routeur "auth"
 * Oriente les requêtes entrantes vers le contrôleur auth
 * ------------------------------------------------------
 */

// On importe express
const express = require('express');

// On créer un router à partir de la méthode Router d'express
const router = express.Router();

// On import le contrôleur "auth"
const authController = require('../controllers/auth');

/**
 * POST /api/auth/signup
 **/
router.post('/signup', authController.signUp);

module.exports = router;
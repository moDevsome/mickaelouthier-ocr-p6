/**
 * --------------------------------------------------------
 * Routeur "sauces"
 * Oriente les requêtes entrantes vers le contrôleur sauces
 * --------------------------------------------------------
 */

// On importe express
const express = require('express');

// On créer un router à partir de la méthode Router d'express
const router = express.Router();

// On import le contrôleur "sauces"
const saucesController = require('../controllers/sauces');

// On import le middleware "auth"
const authMiddleware = require('../middleware/auth');

/**
 * GET /api/sauces
 **/
router.get('/', authMiddleware, saucesController.getSauces);

/**
 * GET /api/sauces/:id
 **/
router.get('/:id', authMiddleware, saucesController.getSauce);

/**
 * POST /api/sauces
 **/
router.post('/', authMiddleware, saucesController.postSauce);

/**
 * PUT /api/sauces/:id
 **/
router.put('/:id', authMiddleware, saucesController.putSauce);

 /**
 * DELETE /api/sauces/:id
 **/
router.delete('/:id', authMiddleware, saucesController.deleteSauce);

/**
 * POST /api/sauces/:id/like
 **/
router.post('/:id/like', authMiddleware, saucesController.postSauceLike);

module.exports = router;
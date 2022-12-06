/**
 * ----------------------------------------
 * Middleware "auth"
 * Vérifie si l'utilisateur est authentifié
 * ----------------------------------------
*/

const jwt = require('jsonwebtoken');
const log = require('../consoleLog');

module.exports = (request, response, next) => {

    log.output('-- Execution du Middleware "auth"');
    const authToken = (request.header('Authorization') || 'NO-tken').replace('Bearer ', '').replace(' ','');

    try {

        const session = jwt.verify(authToken, process.env.PIQUAPI_TKN_SECRET_KEY);

        if(typeof(session._id) === 'undefined') {

            log.output('jwt.verify error : La propriété _id n\'existe pas dans l\'objet issu du décodage', 'error');
            throw 'La propriété _id n\'existe pas dans l\'objet issu du décodage';

        };

        log.output('=> L\'utilisateur est authentifié');
        request.locals = {
            userId: session._id
        }
        next();

    }
    catch(error) {

        log.output('jwt.verify error : '+ error.message, 'error');
        response.status(403).json({
            error
        });

    }

}
/**
 * -------------------------------------------------------------------
 * Fonction permettant de retourner une erreur à destination du client
 * -------------------------------------------------------------------
 *
 * @param Object responseObject L'objet response à mettre à jour
 * @param Number code Le code de la réponse
 * @param String message Le message à retourner
 * @param Object error (optionnel) L'erreur déclenchée par la fonction
 */

module.exports = (responseObject, code, message, error) => {

    responseObject.statusMessage = message;
    const output = typeof(error) === 'undefined' ? {message: message} : {message: error};

    // Affiche l'erreur dans la console
    require('./consoleLog').error(message);

    if(process.env.PIQUAPI_DEV === '1' && typeof(error) !== 'undefined') {

        console.log('[ERROR DETAILS]'+ require('os').EOL, error);

    }

    return responseObject.status(code).json(output);

}
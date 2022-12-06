/**
 * -----------------------------------------------------
 * Contrôleur "sauces"
 * Permet d'effectuer les différentes actions sur l'entité Sauce
 * -----------------------------------------------------
 */

 const log = require('../consoleLog');

 const sauceModel = require('../models/sauce');

/**
 * GET /api/sauces
 *
 * Request body : néant
 * Type de réponse attendue : Array of sauce
 *
 * Renvoie un tableau de toutes les sauces de la base de données
 *
 * @param request La requête Http
 * @param response La réponse Htpp
 * @return Response
*/
// TODO:développer le corps de la méthode
exports.getSauces = (request, response) => {

    console.log('GET /api/sauces');
    return response.status(200).json([]);

}

/**
 * GET /api/sauces/:id
 *
 * Request body : néant
 * Type de réponse attendue : Single sauce
 *
 * Renvoie la sauce avec l’_id fourni
 *
 * @param request La requête Http
 * @param response La réponse Htpp
 * @return Response
*/
// TODO:développer le corps de la méthode
exports.getSauce = (request, response) => {

    return response.status(200).json({});

}

/**
 * POST /api/sauces
 *
 * Request body : { sauce: String, image: File }
 * Type de réponse attendue : { message: String } Verb
 *
 * Capture et enregistre l'image,
 * analyse la sauce transformée en chaîne de caractères et l'enregistre dans la base de données en définissant correctement son imageUrl.
 * Initialise les likes et dislikes de la sauce à 0 et les usersLiked et usersDisliked avec des tableaux vides.
 * Remarquez que le corps de la demande initiale est vide ; lorsque multer est ajouté, il renvoie une chaîne pour le corps de la demande en fonction des données soumises avec le fichier
 *
 * @param request La requête Http
 * @param response La réponse Htpp
 * @return Response
*/
// TODO:développer le corps de la méthode
exports.postSauce = (request, response) => {

    console.log(request.locals.userId);

    return response.status(200).json({
        message : 'La sauce a bien été ajoutée.'
    });

}

/**
 * PUT /api/sauces/:id
 *
 * Request body : EITHER Sauce as JSON OR { sauce: String, image: File }
 * Type de réponse attendue : { message: String }
 *
 * Met à jour la sauce avec l'_id fourni.
 * Si une image est téléchargée, elle est capturée et l’imageUrl de la sauce est mise à jour.
 * Si aucun fichier n'est fourni, les informations sur la sauce se trouvent directement dans le corps de la requête (req.body.name, req.body.heat, etc.).
 * Si un fichier est fourni, la sauce transformée en chaîne de caractères se trouve dans req.body.sauce.
 * Notez que le corps de la demande initiale est vide ; lorsque multer est ajouté, il renvoie une chaîne du corps de la demande basée sur les données soumises avec le fichier.
 *
 * @param request La requête Http
 * @param response La réponse Htpp
 * @return Response
*/
// TODO:développer le corps de la méthode
exports.putSauce = (request, response) => {

    return response.status(200).json({
        message : 'La sauce a bien été mise à jour.'
    });

}

/**
 * DELETE /api/sauces/:id
 *
 * Request body : néant
 * Type de réponse attendue : { message: String }
 *
 * Supprime la sauce avec l'_id fourni.
 *
 * @param request La requête Http
 * @param response La réponse Htpp
 * @return Response
*/
// TODO:développer le corps de la méthode
exports.deleteSauce = (request, response) => {

    return response.status(200).json({
        message : 'La sauce a bien été supprimée.'
    });

}

/**
 * POST /api/sauces/:id/like
 *
 * Request body : { userId: String, like: Number }
 * Type de réponse attendue : { message: String }
 *
 * Définit le statut « Like » pour l' userId fourni.
 * Si like = 1, l'utilisateur aime (= like) la sauce.
 * Si like = 0, l'utilisateur annule son like ou son dislike.
 * Si like = -1, l'utilisateur n'aime pas (= dislike) la sauce.
 * L'ID de l'utilisateur doit être ajouté ou retiré du tableau approprié.
 * Cela permet de garder une trace de leurs préférences et les empêche de liker ou de ne pas disliker la même sauce plusieurs fois :
 * un utilisateur ne peut avoir qu'une seule valeur pour chaque sauce.
 * Le nombre total de « Like » et de « Dislike » est mis à jour à chaque nouvelle notation.
 *
 * @param request La requête Http
 * @param response La réponse Htpp
 * @return Response
*/
// TODO:développer le corps de la méthode
exports.postSauceLike = (request, response) => {

    const responseMessage = 'Merci pour votre opinion !';

    return response.status(200).json({
        message : responseMessage
    });

}
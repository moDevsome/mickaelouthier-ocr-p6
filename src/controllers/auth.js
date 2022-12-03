/**
 * -----------------------------------------------------
 * Contrôleur "auth"
 * Permet l'Inscription et la Connexion de l'utilisateur
 * -----------------------------------------------------
 */

const bcrypt = require('bcrypt');
const userModel = require('../models/user');

/**
 * POST /api/auth/signup
 *
 * Request body : { email: string, password: string }
 * Type de réponse attendue : { message: string }
 *
 * Hachage du mot de passe de l'utilisateur,
 * Ajout de l'utilisateur à la base de données
 *
 * @param request La requête Http
 * @param response La réponse Htpp
 * @return Response
*/
exports.signUp = (request, response) => {

    let errors = [];

    // ----- Validation de l'adresse email -----
    const email = request.body.email || '';
    if(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim.test(email) === false) {

        errors.push('Le format de l\'adresse email fournie n\'est pas correcte, merci de rectifier.');

    }

    // ----- Validation du mot de passe -----
    // On refuse les mots de passe les mots de passe à la structure trop "faible"
    // @see https://owasp.org/Top10/fr/A07_2021-Identification_and_Authentication_Failures/
    //
    // DECOMPOSITION DE LA REGEX 1
    // (?=(?:.*[A-Z À-Ü]){2,}) -> doit contenir 2 majuscules
    // (?=(?:.*[a-z à-ü]){3,}) -> doit contenir 3 minuscules
    // (?=(?:.*[0-9]){2,}) -> doit contenir 2 chiffres
    // (?=(?:.*[!@€#$£~%^&*()\_=+{};:¨,<.>-]){2,}) -> doit contenir au moins 2 caractères spéciaux
    //
    // REGEX 2
    // /(.).*\1{2,}/ -> ne doit pas contenir de caractère qui se répètent plus de 2 fois
    //
    // REGEX 3
    // /(123)|(789)|(321)|(987)/ -> ne doit pas contenir de chaine trop simples
    const password = request.body.password || '';
    const passwordRegex = new RegExp('(?=(?:.*[A-Z À-Ü]){2,})(?=(?:.*[a-z à-ü]){3,})(?=(?:.*[0-9]){2,})(?=(?:.*[!@€#$£~%^&*()\_=+{};:¨,<.>-]){2,})', 'g');
    if(passwordRegex.test(password) === false || (/(.).*\1{2,}/.test(password) === true) || (/(123)|(789)|(321)|(987)/.test(password) === true) || password.length < 8) {

        errors.push('Le mot de passe être complexe et doit contenir au moins 8 caractères dont 3 lettres en minuscule, 2 lettres en majuscule, 2 chiffres et 2 caractères spéciaux. Les caractères ne doivent pas se répeter plus de 2 fois.');

    }

    if(errors.length > 0) {

        return response.status(400).json(
            { message: errors.join('/n') }
        )

    }

    // Hashage du mot de passe (la vérification de la correspondance sera effectuée avec la fonction "bcrypt.compare")
    bcrypt.hash(password, 10)
        .then(hash => {

            // Enregistrement de l'utilisateur en base de données
            const userEntity = userModel({
                email: email,
                password: hash
            })

            userEntity.save()
                .then(result => {

                    return response.status(200).json(
                        { message: 'Votre compte a bien été créé. Nous sommes heureux de vous compter parmis nos utilisateurs.' }
                    )

                })
                .catch(error => {

                    const saveErrors = Object.values(error.errors ?? {});
                    let it = 0;
                    saveErrors.forEach(element => {

                        const kind = element.kind ?? '';
                        const path = element.path ?? '';
                        if(path === 'email' && kind === 'unique') {

                            return response.status(400).json(
                                { message: 'Cette adresse email est déjà associée à l\'un de nos utilisateurs.' }
                            );

                        }

                        it++;

                        // On a parcourus le tableau sans trouver d'erreur connue, donc on retourne une erreur 500
                        if(it === saveErrors.length) {

                            return response.status(500).json(
                                { message: error }
                            )

                        }

                    })

                });



        })
        .catch(error => {

            return response.status(500).json(
                { message: error }
            )

        });

}
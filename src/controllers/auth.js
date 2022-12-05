/**
 * -----------------------------------------------------
 * Contrôleur "auth"
 * Permet l'Inscription et la Connexion de l'utilisateur
 * -----------------------------------------------------
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const log = require('../consoleLog');

const userModel = require('../models/user');

/**
 * Cet objet contient une liste d'IP bannies après avoir dépassé le nombre max de tentative de connexion,
 * cette méthode prévient les attaques par force brute.
 * Les IP vont restées stockées jusu'au redémarrage de l'API
 */
let bannIP = {};

/**
 * Fonction interne permettant de vérifier la structure d'une adresse email
 *
 * @param email email L'email à vérifier
 * @return bool TRUE ou FALSE
*/
const emailValidator = (email) => {

    // TODO: il faut améliorer la regex ! le "-" n'est pas géré !!
    return /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim.test(email);

}

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
    if(emailValidator(email) === false) {

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

/**
 * POST /api/auth/login
 *
 * Request body : { email: string, password: string }
 * Type de réponse attendue : { userId: string, token: string
 *
 * Vérification des informations d'identification de l'utilisateur, renvoie l _id de l'utilisateur depuis la base de données
 * et un token web JSON signé (contenant également l'_id de l'utilisateur).
 *
 * @param request La requête Http
 * @param response La réponse Htpp
 * @return Response
*/
exports.login = (request, response) => {

    log.output('Connexion de l\'utilisateur...');

    // ----- Protection contre les attaques par force brut / Etage 1 -----
    // On définie l'IP et on bloque la requête si l'IP est bannie
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress || '';
    if(Object.keys(bannIP).includes(ip) && bannIP[ip] === 10) {

        return response.status(500).json(
            { message: 'Unknow error' }
        )

    }

    // ----- Validation de l'adresse email -----
    const email = request.body.email || '';
    const requestParams = {
        email: emailValidator(email) === true ? email : 'NULL'
    }

    // ----- Récupération de l'utilisateur associé à l'adresse email -----
    userModel.findOne(requestParams)
        .then(userEntity => {

            if(userEntity === null) { // Aucun utilisateur trouvé en base avec cet email

                return response.status(400).json(
                    { message: 'Cette adresse email n\'est associée à aucun compte utilisateur.' }
                )

            }
            else { // L'utilisateur a bien été trouvé, on vérifie si le mot de passe match

                const password = request.body.password || '';
                bcrypt.compare(password, userEntity.password)
                    .then(result => {

                        if(result === false) { // Le mot de passe n'est pas correcte

                            // ----- Protection contre les attaques par force brut / Etage 2 -----
                            // On stock l'IP dans le buffer bannIP
                            /*
                            On limite le nombre d'octet à 300 000 pour ne pas occuper plus de 5 Mo de RAM
                            on part du fait que 3 IP = 53 octets occupés
                            3 => 53 octet
                            30 => 530 octet
                            300 => 5300 octet
                            3000 => 53000 octet
                            30000 => 530000 octet
                            300000 => 5300000 octet
                            */
                            if(Object.keys(bannIP).length === 300000 && !Object.keys(bannIP).includes(ip)) {

                                bannIP = {};

                            }
                            bannIP[ip] = Object.keys(bannIP).includes(ip) ? bannIP[ip] + 1 : 0;

                            return response.status(400).json(
                                { message: 'Le mot de passe n\'est pas correcte, merci de rectifier.' }
                            )

                        }
                        else {

                            try {

                                log.output('=> Réussite de la connexion de l\'utilisateur.', 'success')
                                return response.status(200).json(
                                    {
                                        userId: userEntity._id,
                                        token: jwt.sign({ _id : userEntity._id }, process.env.PIQUAPI_TKN_SECRET_KEY, { expiresIn: '2h' })
                                    }
                                );

                            }
                            catch(error) {

                                log.output('jwt.sign Error', 'error');
                                log.output(error.message, 'error');
                                return response.status(500).json(
                                    { message: error }
                                )

                            }

                        }

                    })
                    .catch(error => {

                        log.output('bcrypt.compare Error', 'error');
                        log.output(error.message, 'error');
                        return response.status(500).json(
                            { message: error }
                        )

                    });

            }

        })
        .catch(error => {

            return response.status(500).json(
                { message: error }
            )

        });
}
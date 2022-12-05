/**
 * -----------------------------
 * Point d'entrée du serveur Web
 * -----------------------------
 */

const log = require('./consoleLog');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { resolve } = require('path');
const { rejects } = require('assert');

/**
 * Fonction interne permettant de charger la configuration à partir du fichier ".env" se trouvant à la racine du répertoire d'execution de l'API
 *r
 * @return Promise
*/
function loadConfiguration() {

    return new Promise((resolve, reject) => {

        // Chargement du fichier de configuration
        dotenv.config();
        const envKeys = Object.keys(process.env);
        const apiEnvKeys = ['PIQUAPI_DB_CLUSTER','PIQUAPI_DB_NAME','PIQUAPI_DB_USER','PIQUAPI_DB_PASS','PIQUAPI_TKN_SECRET_KEY','PIQUAPI_DEV'];
        let matchKeyCounter = 0;
        apiEnvKeys.forEach(apiEnvKey => {

            if(envKeys.includes(apiEnvKey)) matchKeyCounter++;

        });

        if(matchKeyCounter === apiEnvKeys.length) resolve();
        else reject();

    })

}

/**
 * Démarrage du serveur web et Connexion à la base de données
 */
log.output('-- Démarrage de l\'API...');
require('http').createServer( require('./api') ).listen(3000)
    .on('error', (error) => {

        log.output('=> Echec du démarrage de l\'API', 'error');
        console.error(error);

    })
    .on('listening', async () => {

        log.output('=> L\'API est disponible sur l\'URL http://localhost:3000', 'success');

        log.output('-- Chargement du fichier de configuration...');
        await loadConfiguration()
            .then(() => {

                log.output('=> Réussite du chargement de la configuration.', 'success');

            })
            .catch(() => {

                log.output('=> Échec du chargement de la configuration. Le fichier ".env" est absent ou corrompu.', 'error');
                process.exit();

            })


        log.output('-- Connexion à la base de données MongoDB...');
        mongoose.connect(
            'mongodb+srv://'+ process.env.PIQUAPI_DB_USER +':'+ process.env.PIQUAPI_DB_PASS +'@'+ process.env.PIQUAPI_DB_CLUSTER +'/'+ process.env.PIQUAPI_DB_NAME +'?retryWrites=true&w=majority', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => {

                log.output('=> Réussite de la connexion à la base de données MongoDB.', 'success');

            })
            .catch(error => {

                log.output('=> Echec de la connexion à la base de données MongoDB.', 'error');
                console.error(error);
                process.exit();

            });

    });
/**
 * -----------------------------
 * Point d'entrée du serveur Web
 * -----------------------------
 */

const log = require('./consoleLog');
const fs = require('fs');
const mongoose = require('mongoose');

/**
 * Démarrage du serveur web et Connexion à la base de données
 */
log.output('-- Démarrage de l\'API...');
require('http').createServer( require('./api') ).listen(3000)
    .on('error', (error) => {

        log.output('=> Echec du démarrage de l\'API', 'error');
        console.error(error);

    })
    .on('listening', () => {

        log.output('=> L\'API est disponible sur l\'URL http://localhost:3000', 'success');

        // Parse le fichier JSON contenant les informations de connexion à la base de données
        const mongoconfFilePath = __dirname.replace('src', '.mongoconf');
        let mongoconf = {};
        try {

            if(!fs.existsSync(mongoconfFilePath)) {

                throw 'Le fichier n\'existe pas.';

            }

            mongoconf = JSON.parse(fs.readFileSync(mongoconfFilePath));

        }
        catch(error) {

            log.output('Echec de la récuperation des accès à la base de données via le fichier de configuration.', 'error');
            log.output(error, 'error');
            process.exit();

        }

        log.output('-- Connexion à la base de données MongoDB...');
        mongoose.connect(
            'mongodb+srv://'+ mongoconf.db_user +':'+ mongoconf.db_pass +'@'+ mongoconf.db_cluster +'/'+ mongoconf.db_name +'?retryWrites=true&w=majority', {
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
/**
 * Point d'entrée du serveur Web
 */

console.log('Démarrage de l\'API...');
require('http').createServer( require('./app') ).listen(3000)
    .on('error', (error) => {

        console.error('\x1b[31m=> Echec du démarrage de L\'API\x1b[0m')
        console.error(error);

    })
    .on('listening', () => {

        console.log('\x1b[32m=> L\'API est disponible sur l\'URL http://localhost:3000\x1b[0m');

    })
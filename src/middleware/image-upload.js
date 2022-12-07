/**
 * ----------------------------------------------------
 * Middleware "image-upload"
 * Traite la photo de la sauce postée par l'utilisateur
 * ----------------------------------------------------
*/

const multer = require('multer');

/**
 * Fonction interne permettant de générer un nom de fichier le plus original possible (pas au sens artistique du terme...)
 *
 * @param extension L'extension du fichier
 * @return string Le nom généré
*/
function generateFilename(extension) {

    const characters = 'TUVWXYZabcderstuvwxyz016789mp'.split('');
    const timestamp = Date.now();
    const timestampStringArray = timestamp.toString().split('');
    const charactersRandomOffset = [
        parseInt(timestampStringArray[timestampStringArray.length - 1]),
        parseInt(timestampStringArray[timestampStringArray.length - 2]) * 2,
        parseInt(timestampStringArray[timestampStringArray.length - 3]) * 3
    ]
    const someGlue = characters[charactersRandomOffset[0]] + characters[charactersRandomOffset[1]] + characters[charactersRandomOffset[2]];

    return timestamp +'_'+ someGlue +'_'+ Math.random(0, timestamp) +'.'+ extension;

}

module.exports = multer({

    storage: multer.diskStorage({
        destination: (request, file, callback) => {
            callback(null, 'images');
        },
        filename: (request, file, callback) => {

            const mimeTypes = {
                'image/jpg': 'jpg',
                'image/jpeg': 'jpg',
                'image/png': 'png'
            }

            // On vérifie si le type de fichier est autorisé
            if(!Object.keys(mimeTypes).includes(file.mimetype)) {

                callback(new Error('Le type de fichier n\'est pas autorisé'));

            }
            else {

                const extension = mimeTypes[file.mimetype];

                const uploadedFilename = generateFilename(extension);
                callback(null, uploadedFilename);

            }

        }
    })

}).single('image');
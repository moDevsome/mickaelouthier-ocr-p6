/**
 * ------------------------------------------------------------
 * Class permettant d'afficher des informations dans la console
 * ------------------------------------------------------------
 *
*/

module.exports = class {

    /**
     * Affiche le message "content" en couleur dans la console
     *
     * @param string content
     * @param string type
     * @return void
     */
    static output(content, type) {

        const logTypesColor = {
            'error': '31m',
            'notice':'37m',
            'success':'32m',
            'warning':'33m'
        }

        const logType = typeof(type) !== 'string' || !Object.keys(logTypesColor).includes(type) ? 'notice' : type;
        const message = '\x1b['+ logTypesColor[logType] + content +'\x1b[0m'

        if(logType === 'error') console.error(message);
        else console.log(message);

        return;
    }

    /**
     * Affiche le message "content" en rouge dans la console
     *
     * @param string content
     * @return void
     */
    static error(content) {

        this.output('[ERROR]'+ require('os').EOL + content, 'error');

    }

    /**
     * Affiche le message "content" en vert dans la console
     *
     * @param string content
     * @return void
     */
    static success(content) {

        this.output('[SUCCESS]'+ require('os').EOL + content, 'success');

    }

    /**
     * Affiche le message "content" en orange dans la console
     *
     * @param string content
     * @return void
     */
    static warning(content) {

        this.output('[WARNING]'+ require('os').EOL + content, 'warning');

    }

}
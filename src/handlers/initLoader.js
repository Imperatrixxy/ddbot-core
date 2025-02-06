import url from 'url';
import getFiles from '../util/getFiles.js';

class InitLoader {
    constructor(handler, client, dir) {
        this.loadInitFunctions(handler, client, dir);
    }

    async loadInitFunctions(handler, client, dir) {
        const files = getFiles(dir);

        for (const file of files) {
            const filePath = url.pathToFileURL(file);
            const initFunction = (await import(filePath)).default;

            initFunction(client, handler);
        }
    }
}

export default InitLoader;
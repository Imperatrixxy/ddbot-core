import path from 'path';
import url from 'url';

import getFiles from '../util/getFiles.js';

export default class EventHandler {
    _eventListeners = new Map();

    constructor(handler, client, events) {
        if (!events.dir) {
            throw new Error('Events directory was not specified.');
        }

        this.setUp(handler, client, events.dir);
    }

    async setUp(handler, client, dir) {
        await this.loadListeners(dir);
        this.registerEvents(handler, client);
    }

    async loadListeners(dir) {
        const eventFolders = getFiles(dir, true);

        for (const folder of eventFolders) {
            const event = path.basename(folder);
            const files = getFiles(folder);
            
            const eventListeners = this._eventListeners.get(event) || [];

            for (const file of files) {
                const filePath = url.pathToFileURL(file);
                const eventListener = (await import(filePath)).default;

                eventListeners.push(eventListener);
            }

            this._eventListeners.set(event, eventListeners);
        }
    }

    registerEvents(handler, client) {
        for (const [event, functions] of this._eventListeners) {
            client.on(event, function () {
                for (const f of functions) {
                    try {
                        f(...arguments, handler)
                    } catch(e) {
                        console.error(e);
                    }
                }
            });
        }
    }
}
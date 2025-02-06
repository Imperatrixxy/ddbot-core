import CommandHandler from './cmdHandler/commandHandler.js';
import EventHandler from './eventHandler.js';
import InitLoader from './initLoader.js';

class HandlerOfThings {
    constructor({
        client,
        events,
        commandsDir,
        initDir,
        devServers = [],
        developers = [],
    }) {
        if (!client) {
            throw new Error('Client is not present!');
        }

        this._client = client;
        this._cooldowns = new Map();

        if (events) {
            new EventHandler(this, client, events);
        }

        this._devServers = devServers;
        this._developers = developers;

        if (commandsDir) {
            this._commandHandler = new CommandHandler(this, client, commandsDir);
        }

        if (initDir) {
            new InitLoader(this, client, initDir);
        }
    }

    get client() {
        return this._client;
    }

    get cooldowns() {
        return this._cooldowns;
    }

    get commandHandler() {
        return this._commandHandler;
    }

    get devServers() {
        return this._devServers;
    }

    get developers() {
        return this._developers;
    }
}

export default HandlerOfThings;
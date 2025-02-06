import { ApplicationCommandType } from 'discord.js';

import path from 'path';
import { pathToFileURL } from 'url';

import getFiles from '../../util/getFiles.js';
import AppCommands from './appCommands.js';
import PrefixHandler from './prefixHandler.js';
import legacyType from './legacyType.js';

export default class CommandHandler {
    _commands = new Map();
    _prefixes = new PrefixHandler();

    constructor(handler, client, commandsDir) {
        this._client = client;
        this._appCommands = new AppCommands(client);
        this.setUp(commandsDir, handler);
    }

    get commands() {
        return this._commands;
    }

    get appCommands() {
        return this._appCommands;
    }

    get prefixes() {
        return this._prefixes;
    }

    async getValidations(){
        const folder = path.join(import.meta.dirname, 'validations');
        if (!folder) return [];

        const theFiles = getFiles(folder);

        const validations = []

        for (const file of theFiles) {
            const filePath = pathToFileURL(file);

            const validation = (await import(filePath)).default;

            if(!validation) continue;

            validations.push(validation);
        }
        return validations;
    }

    async setUp(commandsDir, handler) {
        const registeredCommands = [];

        const commands = getFiles(commandsDir);

        for (const command of commands) {
            const fileName = path.basename(command);

            const filePath = pathToFileURL(command);

            const commandObject = (await import(filePath)).default;
            
            if (!commandObject) continue;

            const name = commandObject.name || path.parse(fileName).name.toLowerCase();

            const {
                nameLocalizations = null,
                description = '',
                descriptionLocalizations = null,
                permissions,
                options = [],
                aliases = [],
                nsfw = false,
                dev,
                legacy = legacyType.None,
                slash = true,
                type = ApplicationCommandType.ChatInput,
                disabled = false,
                execute,
                init = function () {}
            } = commandObject;

            if (disabled === true) {
                if (slash !== false) {
                    for (const guildId of handler.devServers){
                        this.appCommands.delete(name, guildId);
                    }
        
                    this.appCommands.delete(name);
                }

                continue;
            };

            const validations = await this.getValidations();

            for(const validation of validations) {
                validation({ handler, name, nameLocalizations, description, descriptionLocalizations, options, execute, nsfw, type });
            }

            await init(handler.client, handler);
            this._commands.set(name, commandObject);

            if (legacy !== legacyType.None) {
                for (const alias of aliases) {
                    this._commands.set(alias, commandObject);
                }
            }

            if (slash !== false) {
                registeredCommands.push({ name, type });
                if (dev) {
                    for (const guildId of handler.devServers){
                        this.appCommands.create(
                            name,
                            nameLocalizations,
                            description,
                            descriptionLocalizations,
                            permissions,
                            options,
                            nsfw,
                            type,
                            guildId
                        );
                    }
                } else {
                    this.appCommands.create(
                        name,
                        nameLocalizations,
                        description,
                        descriptionLocalizations,
                        permissions,
                        options,
                        nsfw,
                        type
                    );
                }
            }
        }

        this.deleteRemovedCommands(registeredCommands, handler);
    }

    async deleteRemovedCommands(registeredCommands, handler) {
        const { cache: globalCommands } = await this.appCommands.getCommands();
        const globalCommandsMap = globalCommands.map((command) => command);
        for (const command of globalCommandsMap) {
            const cmdFilter = registeredCommands.find((a) => a.name === command.name && a.type === command.type);
            if(!cmdFilter) this.appCommands.delete(command.name, command.type);
        }

        for (const guildId of handler.devServers) {
            const { cache: guildCommands } = await this.appCommands.getCommands(guildId);
            const guildCommandsMap = guildCommands.map((command) => command);
            for (const command of guildCommandsMap) {
                const cmdFilter = registeredCommands.find((a) => a.name === command.name && a.type === command.type);
                if(!cmdFilter) this.appCommands.delete(command.name, command.type, guildId);
            }
        }
    }
}
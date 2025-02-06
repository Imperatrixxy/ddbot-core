import { ApplicationCommandType as Type } from "discord.js";

function checkName({ handler, name, type, options }) {
    const illegalChars = /[^-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]/u;

    if(handler) {
        const foundCommands = handler.commandHandler.commands || new Map();
        for (let [key, value] of foundCommands) {
            if (key.toLowerCase() === name.toLowerCase() && value.type === type) {
                throw new Error(name, 'Multiple commands of the same name and type was detected. Rename or delete any duplicates and try again');
            }
        }
    }

    if(name.length > 32 || name.length < 1) {
        throw new Error(name, 'The command name needs to be between 1-32 characters long!');
    }

    if (type === Type.Message || type === Type.User) return;

    if (illegalChars.test(name)) {
        throw new Error(name, 'The command name includes characters not permitted by the Discord API.');
    }

    if(options) {
        for( const option of options) {
            checkName(option);
        }
    };
}

export default checkName;
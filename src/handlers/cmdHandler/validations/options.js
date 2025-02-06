import { ApplicationCommandType as Type } from "discord.js";

export default function({ name, options, type }) {
    if (type === Type.ChatInput) return;

    if ( options && options.length ) {
        throw new Error(
            `Command ${name} is not a slash command and cannot have options.`
        );
    }
}
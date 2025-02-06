import { ApplicationCommandType as Type } from 'discord.js';

export default function({ name, description, type }) {
    if (type !== Type.ChatInput) return;

    if(!description) {
        throw new Error(
            `Command ${name} is missing a description, which is required for application commands.`
        );
    }

    if(typeof description !== 'string' || description.length < 1 || description.length > 100) {
        throw new Error(
            `The description of command ${name} needs to be a string between 1-100 characters long.`
        );
    }
}
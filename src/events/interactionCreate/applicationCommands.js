import { CommandInteraction } from 'discord.js';
import HandlerOfThings from '../../handlers/handleThings.js'
import runCommand from '../../handlers/cmdHandler/runCommand.js';

/**
 * 
 * @param {CommandInteraction} interaction 
 * @param {HandlerOfThings} handler 
 * @returns 
 */

export default async function (interaction, handler) {
    if (!interaction.isChatInputCommand()) return;

    const { client } = handler;

    const { commandName, guild, channel, member, user, options } = interaction;
    const args = options.data.map(({value}) => value);
    
    await runCommand({
        commandName,
        client,
        handler,
        interaction,
        guild,
        channel,
        member,
        user,
        options,
        args
    });
}
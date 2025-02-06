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
    if (
        !interaction.isUserContextMenuCommand() &&
        !interaction.isMessageContextMenuCommand()
    ) return;

    console.log('Context!');

    const { client } = handler;

    const { commandName, guild, member, user } = interaction;
    
    await runCommand({
        commandName,
        client,
        handler,
        interaction,
        guild,
        member,
        user
    });
}
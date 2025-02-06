import { ApplicationCommandOptionType as OptionType, PermissionFlagsBits } from 'discord.js';
import legacyType from '../../handlers/cmdHandler/legacyType.js';

export default {
    name: 'prefix',
    description: 'Check or modify the prefix for this server',
    permissions: [
        PermissionFlagsBits.Administrator
    ],
    options: [
        {
            name: 'prefix',
            description: 'The prefix you want to use',
            type: OptionType.String
        }
    ],
    legacy: legacyType.Any,
    execute: function({ interaction, options, reply, handler, guild, text }) {

        const prefix = interaction ? options.getString('prefix') : text;

        if(!prefix || prefix === ''){
            const currentPrefix = handler.commandHandler.prefixes.get(guild.id);
            reply({ content: `The current prefix is **${currentPrefix}**` });
        } else {
            handler.commandHandler.prefixes.set(guild.id, prefix);
            reply({ content: `Set **${prefix}** as the command prefix for this server` });
        }
    }
}
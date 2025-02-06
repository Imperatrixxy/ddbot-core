import { ApplicationCommandType, UserContextMenuCommandInteraction } from "discord.js"

/**
 * @param {UserContextMenuCommandInteraction} interaction
 * 
 */

export default {
	name: 'Poke',
    description: 'Poke someone',
    type: ApplicationCommandType.User,
	execute: function ({ interaction }) {
        const poker = interaction.user.id;
        const poked = interaction.targetId;
        
        interaction.reply({ content: `<@${poker}> poked <@${poked}>.`});
	}
}
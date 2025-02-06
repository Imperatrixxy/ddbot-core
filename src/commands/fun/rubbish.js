import { ApplicationCommandType } from "discord.js"

export default {
	name: 'Rubbish',
    type: ApplicationCommandType.Message,
	execute: function ({ interaction }) {
        const poker = interaction.user.id;
        
        interaction.reply({ content: `<@${poker}> thinks this message is rubbish.`});
	}
}
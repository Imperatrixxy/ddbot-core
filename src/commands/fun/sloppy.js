import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import legacyType from '../../handlers/cmdHandler/legacyType.js';

const sloppehEmbed = new EmbedBuilder()
	//.setColor(0x36393F)
    .setTitle('Message from the Griffin')
    .setURL('https://dennydraws.tumblr.com/')
    .setImage('https://64.media.tumblr.com/c42c28fa0fe8ecba24f09d26e197bacc/tumblr_ojzwi62RXy1sp7o47o1_1280.png')
    .setFooter({text: 'Art is by Denny Draws'});

export default {
	name: 'sloppy',
	legacy: legacyType.Prefix,
	description: 'Displays a greeting from Ilberd of the Dull Blade!',
	execute: async function ({ interaction, message }) {
		if(message) return message.reply({ embeds: [sloppehEmbed] });
		interaction.reply({ embeds: [sloppehEmbed] });
	}
}
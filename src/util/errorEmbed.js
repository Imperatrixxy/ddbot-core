import { EmbedBuilder } from 'discord.js';

const errorEmbed = new EmbedBuilder()
    .setTitle('Oops!')
    .setColor('Red')
    .setDescription('Something went wrong there...');

export default errorEmbed;
import { PermissionFlagsBits } from 'discord.js';
import legacyType from '../../handlers/cmdHandler/legacyType.js';

export default {
    name: 'ping',
    nameLocalizations: {
        ja: 'ピン',
    },
    description: 'Tests the bot latency',
    descriptionLocalizations: {
        da: 'Tester bottens latenstid',
        de: 'Testet die Latenz des Bots',
        fi: 'Testaa botin latenssia',
        ja: 'ボットの待ち時間をテストします',
        nl: 'Test de latentie van de bot',
        no: 'Tester botens latens',
        'sv-SE': 'Testar botens latens',
    },
    nsfw: false,
    permissions: [
        //PermissionFlagsBits.Administrator
    ],
    legacy: legacyType.Any,
    cooldown: 10,
    execute: async function ({ interaction, message, client }) {
        let pingMsg;

        if (interaction) {
            pingMsg = await interaction.deferReply({ withResponse: true }).then((cmd) => {return cmd.resource.message});
        } else {
            pingMsg = await message.reply({ content: 'Pinging...', allowedMentions: { repliedUser: false } });
        }

        const latency = pingMsg.createdTimestamp - (message ? message.createdTimestamp : interaction.createdTimestamp);
        const pong = {
            content: `Pong! The message round-trip took ${latency}ms.\nThe heartbeat ping is ${client.ws.ping}ms.`,
            allowedMentions: { repliedUser: false }
        };

        message ? pingMsg.edit(pong) : interaction.editReply(pong);
    }
}
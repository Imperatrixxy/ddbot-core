import { ApplicationCommandOptionType as Type, PermissionFlagsBits, MessageFlags, CommandInteraction, Client } from "discord.js";

/**
 * @param {CommandInteraction} interaction
 * @param {Client} client
 */

export default {
    name: 'emit',
    description: 'Discord event emitter',
    permissions: [
        PermissionFlagsBits.Administrator
    ],
    options: [
        {
            name: 'member',
            description: 'Guild member events',
            type: Type.String,
            required: true,
            choices: [
                {
                    name: 'Simulate user joining',
                    value: 'guildMemberAdd'
                },
                {
                    name: 'Simulate user leaving',
                    value: 'guildMemberRemove'
                },
                {
                    name: 'Simulate adding bot to server',
                    value: 'guildCreate'
                }
            ]
        }
    ],
    execute: async function ({ interaction, client }) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const choices = interaction.options.getString('member');

        client.emit(choices, interaction.member);

        if (choices === 'guildMemberAdd') {
            return interaction.editReply({ content: 'Gasp! You just "joined" the server!' });
        }

        if (choices === 'guildMemberRemove') {
            return interaction.editReply({ content: 'Gasp! You just "left" the server!' });
        }

        if (choices === 'guildCreate') {
            return interaction.editReply({ content: 'Gasp! I just "joined" the server!' });
        }

        return interaction.deleteReply();
    }
}
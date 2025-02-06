import { ApplicationCommandOptionType as Type, PermissionFlagsBits, MessageFlags } from 'discord.js';

export default {
    name: 'delete',
    description: 'Deletes X amount of messages',
    nameLocalizations: {
        'sv-SE': 'radera',
        de: 'löschen',
    },
    descriptionLocalizations: {
            'sv-SE': 'Raderar X antal meddelanden.',
    },
    permissions: [
        PermissionFlagsBits.ManageMessages
    ],
    options: [
        {
            type: Type.Number,
            name: 'amount',
            nameLocalizations: {
                'sv-SE': 'antal',
                de: 'menge',
            },
            description: 'Amount of messages to delete, between 1 and 99',
            descriptionLocalizations: {
                'sv-SE': 'Antal meddelanden att radera, mellan 1 och 99',
            },
            required: true
        },
        {
            type: Type.User,
            name: 'target',
            nameLocalizations: {
                'sv-SE': 'mål',
                de: 'ziel',
            },
            description: 'User whose messages you want to delete.',
            descriptionLocalizations: {
                'sv-SE': 'Användare vars meddelanden du vill radera.',
            },
        }
    ],
    execute: async function ({ channel, options, reply }) {
        
        const clearAmount = options.getNumber('amount');
        const clearTarget = options.getUser('target');
        
        if (clearAmount < 1 || clearAmount > 99) {
            return interaction.reply({ content: 'Please input a valid amount, will you?', flags: MessageFlags.Ephemeral});
        }
        
        const messages = await channel.messages.fetch();
        
        const filtered = [];
        if(clearTarget) {
            let i = 0;
            messages.filter((msg) => {
                if(msg.author.id === clearTarget.id && clearAmount > i) {
                    filtered.push(msg);
                    i++;
                }
            });
        }

        await channel.bulkDelete(filtered.length ? filtered : clearAmount, true).then(messages => {
            reply({ content: `Deleted ${messages.size} messages${clearTarget ? ` made by ${clearTarget}.` : '.'}`, flags: MessageFlags.Ephemeral });
        });
    }
}
import { ApplicationCommandOptionType as Type, EmbedBuilder, MessageFlags } from 'discord.js';
import errorEmbed from '../../util/errorEmbed.js'

const maxDays = function(year, month) {
    let d = new Date(year, month+1, 0);
    return d.getDate();
}

export default {
    name: 'timestamp',
    description: 'Generate a timestamp',
    options: [
        {
            type: Type.String,
            name: 'time',
            description: 'The time you want to display, in GMT/UTC',
            required: true,
        },
        {
            type: Type.String,
            name: 'date',
            description: 'Specify the date (YYYY-MM-DD)',
        },
        {
            type: Type.String,
            name: 'flag',
            description: 'Format the timestamp',
            choices: [
                { name: 'Time', value: 't' },
				{ name: 'Short date', value: 'd' },
				{ name: 'Long date', value: 'D' },
				{ name: 'Short date/time', value: 'f' },
				{ name: 'Long date/time', value: 'F' },
				{ name: 'Relative time', value: 'R' },
            ]
        },
    ],
    execute: async function({ options, reply }) {
        const time = options.getString('time');
        const date = options.getString('date');
        const flag = options.getString('flag');
        const theDay = new Date();

        if (date) {
            const split = date.split('-');
            let year = parseInt(split[0]);
            let month = parseInt(split[1]);
            let day = parseInt(split[2]);

            if (month < 1 || month > 12 || day < 1 || day > maxDays(year, month)) {
                errorEmbed.setDescription(`That doesn't sound like a valid date. Please try again!`);
                return reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
            }

            theDay.setUTCFullYear(year);
            theDay.setUTCMonth(month-1);
            theDay.setUTCDate(day);
        }

        const regexTime = /^([0-1]?[0-9]|2[0-3])[:.][0-5][0-9]$/;

        if (!regexTime.test(time)) {
            errorEmbed.setDescription(`That doesn't sound like a valid time. Please try again!`);
            return reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }

        let [ hours, minutes ] = time.split(/[:.]/);

        hours = parseInt(hours);
        minutes = parseInt(minutes);

        theDay.setUTCHours(hours);
        theDay.setUTCMinutes(minutes);
        theDay.setUTCSeconds(0);

        const timeStamp = Math.floor(theDay / 1000);

        const timeEmbed = new EmbedBuilder()
            .setColor('Purple')
            .setTitle('Timestamp generated')
            .setDescription(`\`<t:${timeStamp}${flag ? ':' + flag : ''}>\``)
            .addFields({
                name: 'Example',
                value: `<t:${timeStamp}${flag ? ':' + flag : ''}>`
            });
        
        return reply({ embeds: [timeEmbed], flags: MessageFlags.Ephemeral });
    }
}
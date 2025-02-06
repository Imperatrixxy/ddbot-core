import runCommand from '../../handlers/cmdHandler/runCommand.js';
import legacyType from '../../handlers/cmdHandler/legacyType.js';

export default function (message, handler) {
    const { client } = handler;
    const { author, guild, channel, member } = message;
    const botPing = new RegExp(`^<!?@${client.user.id}>`);
    let { content } = message;

    if (author.bot || !botPing.test(content)) return;

    const args = content.split(/ +/g);

    args.shift();
    content = args.join(' ');
    if(!args.length){
        return message.reply({
            content: 'https://tenor.com/view/you-rang-gif-20538562'
        });
    }

    const commandName = args.shift().toLowerCase();

    runCommand({
        commandName,
        client,
        handler,
        message,
        guild,
        channel,
        member,
        user: author,
        args,
        trigger: legacyType.Ping
    });
}
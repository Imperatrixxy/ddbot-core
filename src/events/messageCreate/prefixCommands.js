import runCommand from '../../handlers/cmdHandler/runCommand.js';
import legacyType from '../../handlers/cmdHandler/legacyType.js';

export default function (message, handler) {
    const { commandHandler, client } = handler;
    const { prefixes } = commandHandler;
    const { content, author, guild, channel, member } = message;

    const prefix = prefixes.get(guild.id);

    if (author.bot || !content.startsWith(prefix)) return;

    const args = content.slice(prefix.length).split(/ +/g);
    const commandName = args.shift().toLowerCase();

    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('<@') && args[i].endsWith('>')) {
            args[i] = args[i].slice(2, -1);

            if (args[i].startsWith('!')) {
                args[i] = args[i].slice(1);
            }
        }
    }

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
        trigger: legacyType.Prefix
    });
}
import { Client, GatewayIntentBits as Intents, Partials } from 'discord.js';
import path from 'path';
import 'dotenv/config';
import mongoose from 'mongoose';
import HandlerOfThings from './handlers/handleThings.js';

const devServers = [process.env.DISCORD_DEV_SERVER];
const developers = [process.env.DEVELOPER_ID];

const client = new Client({
    intents: [
        Intents.Guilds,
        Intents.GuildMembers,
        Intents.GuildMessages,
        Intents.DirectMessages,
        Intents.MessageContent
    ],
    partials: [
        Partials.Channel
    ]
});

await mongoose.connect(process.env.MONGO_URI);

client.once('ready', async function () {
    new HandlerOfThings({
        client,
        events: {
            dir: path.join(process.cwd(), 'src', 'events'),
            eventChecks: {
                messageCreate: {
                    isHuman: (message) => !message.author.bot,
                },
            },
        },
        initDir: path.join(process.cwd(), 'src', 'init'),
        commandsDir: path.join(process.cwd(), 'src', 'commands'),
        devServers,
        developers
    });
    console.log(`Logged on as ${client.user.tag}.`);
});

client.login(process.env.DEV_CLIENT_TOKEN);
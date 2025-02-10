import { MessageFlags, PermissionFlagsBits } from 'discord.js';
import coolingDown from './cooldowns.js';
import legacyType from './legacyType.js';
import permissionOverrides from './permissionOverrides.js';

export default async function({
    commandName,
    client,
    handler,
    message,
    interaction,
    guild,
    channel,
    member,
    user,
    args = [],
    options = [],
    trigger
}) {
    const { commandHandler, devServers, developers } = handler;
    const { commands } = commandHandler;

    const command = commands.get(commandName);
    
    if(!command || !command.execute) return;

    const { dev, nsfw = false, guildOnly, devOnly, permissions = [], legacy = legacyType.None } = command;

    async function reply(obj) {
        if (message) {
            await message.reply(obj);
        } else if(interaction) {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(obj);
            } else {
                await interaction.reply(obj);
            }
        }
    }

    if(message) {
        if(legacy === legacyType.None || trigger === legacyType.None) return;
        if(trigger === legacyType.Ping && legacy === legacyType.Prefix) return;
        if(trigger === legacyType.Prefix && legacy === legacyType.Ping) return;

        //Check for permission overrides in the database.
        const customPermission = await permissionOverrides(guild, commandName, member, message);

        //Return if the user is banned from running the command.
        if (customPermission === false) return;

        if(permissions.length && customPermission !== true) {
            const keys = Object.keys(PermissionFlagsBits);
            const missingPermissions = [];

            for (const permission of permissions) {
                if(!member.permissions.has(permission)) {
                    const permissionName = keys.find(
                        key => key === permission || permission === PermissionFlagsBits[key]
                    );

                    missingPermissions.push(permissionName);
                }
            }

            if (missingPermissions.length) {
                reply({
                    content: `You are missing the following permissions: "${missingPermissions.join('\", \"')}"`
                });
                return;
            }
        }

        //Return if the user is trying to run a NSFW command outside of NSFW channels.
        if(nsfw === true && ( channel.nsfw === false || channel.isDMBased() === true ) ) {
            reply({
                content: 'I don\'t think that is appropriate to do here. Please use that in an adults only guild channel!'
            });
            return;
        }
    }
    
    if(dev === true && !devServers.includes(guild?.id)) return;

    const text = args?.join(' ') || null;

    //Handle command cooldowns
    if(command.cooldown) {
        if(await coolingDown(command, handler, user, reply)) return;
    }
    
    if (guildOnly && !guild) {
        /*reply({
            content: 'You can only use this command within a server.',
            flags: MessageFlags.Ephemeral
        });*/
        return;
    };

    if (devOnly && !developers.includes(user.id)) {
        const errorMsg = {
            content: 'You are not authorised to use this command.',
            flags: MessageFlags.Ephemeral
        }
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(errorMsg);
        } else {
            await interaction.reply(errorMsg);
        }
        return;
    }

    try {
        await command.execute({ message, interaction, client, handler, reply, guild, channel, member, user, args, text, options });
    } catch (error) {
        console.error(error);
        const errorMsg = { content: `There was an error while executing the ${commandName} command.`, flags: MessageFlags.Ephemeral };
        if(interaction) {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMsg);
            } else {
                await interaction.reply(errorMsg);
            }
        } else if(message) {
            message.reply(errorMsg);
        }
    }
}
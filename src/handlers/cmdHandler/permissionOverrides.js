import { PermissionFlagsBits } from 'discord.js';
import permissionSchema from '../../models/permissionSchema.js';

function checkRoleOverrides(roleOverrides) {
    const highestRole = {
        id: null,
        name: '',
        position: 0,
        allowed: null
    };

    for (const override of roleOverrides) {
        //Skip if role is lower than the last one
        if(override.position <= highestRole.position) continue;

        //Update the highest role
        highestRole.id = override.id;
        highestRole.name = override.name;
        highestRole.position = override.position;
        highestRole.allowed = override.allowed;
    }

    return highestRole;
}

function checkChannelOverrides(channelOverrides, channel, guildId) {

    const allChannelsId = (BigInt(guildId)-1n).toString();
    
    const allChannels = {
        id: allChannelsId,
        allowed: null
    }

    const currentChannel = {
        id: channel.id,
        allowed: null
    }

    for (const override of channelOverrides) {
        if(override.id === allChannels.id) {
            allChannels.allowed = override.allowed;
        }
        else if(override.id === currentChannel.id) {
            currentChannel.allowed = override.allowed;
        }
    }

    if (currentChannel.allowed !== null) return currentChannel.allowed;

    return allChannels.allowed;
}

async function permissionOverrides (guild, commandName, member, message) {
    const { id: guildId } = guild;
    const { channel } = message;

    //Database query. Will fetch the permissions for only the command that is run.
    const result = await permissionSchema.findById(guildId, {
        "commands": { "$elemMatch": { "name": commandName }},
        "permissions": 1
    });
    if(!result || !result.commands.length) return null;
    
    const { permissions, commands: [{ permissions: commandPerms }] } = result;
    const roleOverrides = [];
    let memberOverride = null;
    const channelOverrides = [];

    //Loop through the saved permissions of the bot, as well as the current command
    for (const permission of [...permissions, ...commandPerms]) {
        //Check for role specific overrides and add to array
        if (permission.type === 1 && member.roles.cache.has(permission.id)) {
            const { name, position } = guild.roles.cache.get(permission.id);

            const element = {
                id: permission.id,
                name,
                position,
                allowed: permission.permission
            };
            
            //Check if the role is already in the array
            let index = roleOverrides.findIndex((item) => item.id === element.id);
            if (index > -1) {
                roleOverrides[index] = element;
                continue;
            } else roleOverrides.push(element);
        }
        //Check for member specific overrides and compare them to the current user.
        if (permission.type === 2 && permission.id === member.id) {
            //User was found. Return their permission, either true or false.
            memberOverride = permission.permission;
        }
        if (permission.type === 3) {
            const element = {
                id: permission.id,
                allowed: permission.permission
            };

            let index = channelOverrides.findIndex((item) => item.id === element.id);
            if (index > -1) {
                channelOverrides[index] = element;
                continue;
            } else channelOverrides.push(element);
        }
    }

    const channelOverride = channelOverrides.length ? checkChannelOverrides(channelOverrides, channel, guildId) : null;

    if(channelOverride === false) return false;

    if(memberOverride !== null) {
        if(memberOverride === false) message.reply({
            content: 'You have been banned from using this command on this server. Contact the owner if you think this is in error.'
        });
        return memberOverride;
    }
    
    const roleOverride = roleOverrides.length ? checkRoleOverrides(roleOverrides) : null;

    if(roleOverride !== null) {
        if(roleOverride.allowed === false) message.reply({
            content: `You are not authorised to use this command because of the role **${roleOverride.name}**. Contact the owner if you think this is in error.`
        });
        return roleOverride.allowed;
    }

    return null;
}

export default permissionOverrides;
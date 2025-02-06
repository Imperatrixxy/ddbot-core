import { ApplicationCommandType } from 'discord.js';
import permissionSchema from '../../models/permissionSchema.js';

export default async function(data, handler) {

    const { client } = handler;
    
    //Abort if the command belongs to another bot
    if(data.applicationId !== client.user.id) return;

    //Gather the neccessary permission data
    const { id: commandId, guildId, permissions } = data;

    //Look for a database entry, and if not found, create one
    let saveData = await permissionSchema.findOne({ _id: guildId });
    if(!saveData) {
        saveData = await permissionSchema.create({
            _id: guildId,
            permissions: [],
            commands: []
        });
    }

    //If the modified permission overrides were universal
    if(commandId === data.applicationId) {
        saveData.permissions = permissions;
    }

    //If the modified permission overrides were command specific
    if(commandId !== data.applicationId) {
        
        //Get the relevant command data
        const { name, type } = await client.application.commands.fetch(commandId);

        //Abort if the command is not a typed command
        //Context commands cannot be legacy commands
        if (type !== ApplicationCommandType.ChatInput) return;

        //Look through any already stored commands
        //and return the position of the relevant command
        if(saveData.commands.length) {
            let index = saveData.commands.findIndex((item) => item.name === name);
            
            //If the command has been stored
            if(index > -1) {
                //Update with the new permission overrides
                saveData.commands[index].id = commandId;
                saveData.commands[index].permissions = permissions;
                //Remove the command if no permission overrides are present
                if(!saveData.commands[index].permissions.length) {
                    saveData.commands[index].deleteOne();
                }
            //Add the command if it doesn't exist
            } else saveData.commands.push({
                id: commandId,
                name,
                permissions
            });
        //Add the command if no commands have been stored
        } else saveData.commands.push({
            id: commandId,
            name,
            permissions
        });

    }

    //Remove the data if no commands have permission overrides
    if(!saveData.commands.length && !saveData.permissions.length) return saveData.deleteOne();
    //I think you know what this does
    await saveData.save();
}
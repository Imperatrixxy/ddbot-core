import { PermissionsBitField, ApplicationCommandType as commandType } from 'discord.js';

export default class AppCommands {
    constructor(client) {
        this._client = client;
    }

    get client() {
        return this._client;
    }

    //Put permissions in a bitfield for easier comparison.
    getPermsBitField(permissions) {
        if(!permissions || !permissions.length) return null;
        return new PermissionsBitField(permissions);
    }

    permsChanged(permsBitField, oldPerms) {
        if (permsBitField === null && oldPerms === null) return false;
        if (permsBitField === null || oldPerms === null) return true;

        const newBitField = permsBitField.bitfield.toString();
        const oldBitField = oldPerms.bitfield.toString();

        if (newBitField !== oldBitField) return true;

        return false;
    }

    async getCommands(guildId) {
        let commands;

        if (guildId) {
            const guild = await this.client.guilds.fetch(guildId);
            commands = guild.commands;
        } else {
            commands = this.client.application.commands;
        }

        //Return the appropriate commands.
        await commands.fetch({ withLocalizations: true });
        return commands;
    }

    propertyChanged(obj1, obj2) {

        //Check the number of parameters in the property
        const p1 = Object.keys(obj1);
        const p2 = Object.keys(obj2);

        if(p1.length !== p2.length) return true;

        //Compare all parameters
        for (const key in obj1) {
            if(key === 'choices') {
                //If amount of choices are different
                if (obj1[key].length !== obj2[key].length) return true;

                //Loop through choices and compare each parameter 
                for (const choice in obj1[key]) {
                    const choice1 = obj1[key][choice];
                    const choice2 = obj2[key][choice];

                    if(
                        !choice2 || choice1.name !== choice2.name || choice1.value !== choice2.value
                    ) return true;

                    //Add missing localisation map for consistency.
                    if (!choice1.nameLocalizations) choice1.nameLocalizations = null;

                    //If both localisation maps are null, nothing has changed.
                    if (choice1.nameLocalizations === null && choice2.nameLocalizations === null) continue;
                    //If this function is still running and one of these are null, something has changed.
                    if (choice1.nameLocalizations === null || choice2.nameLocalizations === null) return true;

                    //Compare the values of the localisation maps, and report any change.
                    if (this.propertyChanged(choice1.nameLocalizations, choice2.nameLocalizations)) return true;

                }

                continue;
            } else if(key === 'options') {
                //Compare sub-options recursively
                if(this.compareOptions(obj1[key], obj2[key])) return true;

                continue;
            } else if(JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
                return true;
            }

        }

        //If function has run this far, no changes have been detected.
        return false;
    }

    compareOptions(options1, options2) {
        
        //Compare the amount of options
        if (options1.length !== options2.length) {
            console.log('Amount of options changed');
            return true;
        }

        //Loop through all options
        for (const index in options1) {

            //Make sure that all optional parameters are equally represented on both sides
            if(!options1[index].required && typeof options2[index].required !== "undefined") options1[index].required = false;
            if(!options1[index].nameLocalizations) options1[index].nameLocalizations = null;
            if(!options1[index].descriptionLocalizations) options1[index].descriptionLocalizations = null;

            //Compare all parameters of the current option.
            if (this.propertyChanged(options1[index], options2[index])) {
                console.log('An option has changed');
                return true;
            }
        }

        //If function is still running, no changes were detected
        return false;
    }

    locChanged(loc1, loc2) {
        if(loc1 === null && loc2 === null) return false;
        if(loc1 === null || loc2 === null) return true;

        if (this.propertyChanged(loc1, loc2)) return true;

        return false;
    }

    async create(
        name,
        nameLocalizations,
        description,
        descriptionLocalizations,
        permissions = [],
        options = [],
        nsfw,
        type = commandType.ChatInput,
        guildId
    ) {

        const commands = await this.getCommands(guildId);

        const permsBitField = this.getPermsBitField(permissions);

        const defaultMemberPermissions = permsBitField?.bitfield || null;

        const existingCommand = commands.cache.find((cmd) => cmd.name === name && cmd.type === type);

        if (existingCommand) {
            const {
                nameLocalizations: oldNameLoc,
                description: oldDesc,
                descriptionLocalizations: oldDescLoc,
                defaultMemberPermissions: oldPerms,
                options: oldOptions,
                nsfw: oldNsfw,
            } = existingCommand;

            const obj1 = JSON.parse(JSON.stringify(options));
            const obj2 = JSON.parse(JSON.stringify(oldOptions));

            const optionsChanged = (this.compareOptions(obj1, obj2, name));

            console.log(`Checking the ${name} command...`);

            const submittedCommand = {};

            if (type === commandType.ChatInput) {
                if (optionsChanged) submittedCommand.options = options;
                if (description !== oldDesc) submittedCommand.description = description;
            }
            if(nsfw !== oldNsfw) submittedCommand.nsfw = nsfw;

            if (this.permsChanged(permsBitField, oldPerms))
                submittedCommand.defaultMemberPermissions = defaultMemberPermissions;
            if (this.locChanged(nameLocalizations, oldNameLoc))
                submittedCommand.nameLocalizations = nameLocalizations;
            if (this.locChanged(descriptionLocalizations, oldDescLoc))
                submittedCommand.descriptionLocalizations = descriptionLocalizations;

            //If any changes were detected, update the command
            if (Object.keys(submittedCommand).length) {
                console.log(`Updating command ${name}...`);
                await commands.edit(existingCommand.id, submittedCommand);
            }
            return;
        }

        const createdCommand = {
            name,
            nameLocalizations,
            defaultMemberPermissions,
            nsfw,
            type
        }

        if (type === commandType.ChatInput){
            createdCommand.description = description;
            createdCommand.descriptionLocalizations = descriptionLocalizations;
            createdCommand.options = options;
        }
        console.log(`Creating command ${name}...`);
        await commands.create(createdCommand);
    }

    async delete(name, type, guildId) {
        const commands = await this.getCommands(guildId);

        const existingCommand = commands.cache.find((cmd) => cmd.name === name && cmd.type === type);

        if (!existingCommand) return;

        console.log(`Removing application command ${name}...`);
        await existingCommand.delete();
    }
}
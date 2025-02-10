# ddBot-core

This is the core version of my Discord bot, featuring only the command handler and a few commands to get started. It is a heavily modified version of the command handler conceived and written by [Alexzander Flores](https://github.com/AlexzanderFlores) for a now defunct course.

## Features

- Full support for application commands handling (slash and context commands)
- Legacy commands handling with support for aliases and mentions
- Cooldowns (Currently only per user, more cooldown types might be added later)
- Event handling
- [MongoDB](https://www.mongodb.com/) support

## Installation

Clone or download the code at the top.
Node.js v18 and above required.

## Getting started
The handler works by initialising the following object in your main bot file (usually called index.js). By default, it requires 
```
new HandlerOfThings({
	client, //Your discord client
	events: {
 		dir: path.join(process.cwd(), 'src', 'events'), //The path to the events directory. 
		eventChecks: { //Adds additional checks based on the functions inside the nested objects.
			messageCreate: {
				//Any files placed inside events/messagecreate/isHuman
				//will only trigger if the message author is not a bot.
				isHuman: (message) => !message.author.bot,
			},
		},
        },
	//Point to folder with any functions that should only be run once at boot.
        initDir: path.join(process.cwd(), 'src', 'init'), 
	//Commands folder. Commands can be freely organised however you feel like within the specified folder.
        commandsDir: path.join(process.cwd(), 'src', 'commands'),
	//Development servers. Should be an array.
        devServers,
	//Users recognised as bot developers.
	//Can be used to bypass restrictions on commands that are not yet ready for prime time.
        developers
    });
```

## Command structure
```
import { ApplicationCommandType, PermissionFlagsBits } from 'discord.js';
import legacyType from '../../handlers/cmdHandler/legacyType.js';

export default {
	name: 'ping', //Optional. If not found, will default to filename (without the file extension)
	aliases: [pong, latency] //Optional, only affects legacy commands
	//Want to localise your command name to multiple languages? Use the following property:
	type: ApplicationCommandType.ChatInput //Will default to ChatInput, so only required for context commands.
	nameLocalizations: {
		//keys should be named after the language's locale code
		ja: 'ピン',
	},
	description: 'Tests the bot latency', //Required
	//Want to localise your command description to multiple languages? Use the following property:
	descriptionLocalizations: {
		ja: 'ボットの待ち時間をテストします',
	},
	options: [{
		//Application command options go here *
		//Optional for legacy commands and not allowed in context commands
	}],
	dev: false, //Set to true if you only want it to work on the specified development server(s)
	nsfw: false, //Determines if this command will only work in NSFW channels. Defaults to false if not specified.
	slash: true, //Boolean, defaults to true if not specified.
	legacy: legacyType.Any, //If you want this command to be executable in legacy mode, supports Ping, Prefix, Any, or None
	disabled: false, //
	cooldown: 5, //Cooldown in seconds
	//The bot will hide any slash commands that requires the listed permission(s) if you don't have them
	//It will also respond with an error message if you try to use such a command in legacy mode
	defaultMemberPermissions: [
		PermissionFlagBits.Administrator
	],
	init: function({ /* variables */ }) {
		//Code run at bootup goes here
	},
	execute: async function({ /* variables */ }) {
		//Code run at command activation goes here
	}
}
```
*See Discord's [ApplicationCommandOption structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure) for more info about command options.

## Event/Init structure
All event files are placed in folders named after the event that triggers them. For example, the legacy command files are placed inside the "messageCreate" folder, and application command triggers are found inside the "interactionCreate" folder. They can further be placed inside subfolders with additional conditions set within the handler object inside of the main file (see "getting started" above).
Init codes are placed inside the specified init folder. They can be organised inside subfolders however you like to have them.

```
export default function (/* parameters */) {
	//Code goes here
}
```

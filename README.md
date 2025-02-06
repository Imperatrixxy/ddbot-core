# ddBot-core

This is the core version of my Discord bot, featuring only the command handler and a few commands to get started.

## Features

- Full support for application commands handling (slash and context commands)
- Legacy commands handling with support for aliases and mentions
- Cooldowns (Currently only per user)
- Event handling
- [MongoDB](https://www.mongodb.com/) support

## Installation

Clone or download the code at the top.
Node.js v18 and above required.

## Getting started

## Command structure
```
import { PermissionFlagsBits } from 'discord.js';
import legacyType from '../../handlers/cmdHandler/legacyType.js';

export default {
	name: 'ping', //Optional. If not found, will default to filename (without the file extension)
	//Want to localise your command name to multiple languages? Use the following property:
	nameLocalizations: {
		ja: 'ピン',
	},
	description: 'Tests the bot latency', //Required
	//Want to localise your command description to multiple languages? Use the following property:
	descriptionLocalizations: {
		ja: 'ボットの待ち時間をテストします',
	},
  nsfw: false //Determines if this command will only work in NSFW channels
  legacy: legacyType.Any //If you want this command to be executable in legacy mode, supports Ping, Prefix, Any, or None
  cooldown: 5 //Cooldown in seconds
  //The bot will hide any slash commands that requires the listed permission(s) if you don't have them
  //It will also respond with an error message if you try to use such a command in legacy mode
	defaultMemberPermissions: [
		PermissionFlagBits.Administrator
	],

	execute: async function({ /* variables */ }) {
		//Command code goes here
	}
}
```

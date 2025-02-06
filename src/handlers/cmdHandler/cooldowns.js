import { MessageFlags } from 'discord.js';

async function coolingDown(command, handler, user, reply) {
    const { cooldowns } = handler;

    if(!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Map());
    }

    const timeStamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown) * 1000;

    if(timeStamps.has(user.id)) {
        const expirationTime = timeStamps.get(user.id) + cooldownAmount;

        if(Date.now() < expirationTime) {
            const expiredTimestamp = Math.round(expirationTime / 1000);
            const errorMsg = { content: `This command is currently on cooldown. Please try again <t:${expiredTimestamp}:R>.`, flags: MessageFlags.Ephemeral };
            await reply(errorMsg);
            return true;
        }
    }

    timeStamps.set(user.id, Date.now());
    setTimeout(() => timeStamps.delete(user.id), cooldownAmount);
    return false;
}

export default coolingDown;
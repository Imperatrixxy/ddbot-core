export default async function (interaction, handler) {
    if (!interaction.isAutocomplete) return;

    const { commandHandler } = handler;
    const { commandName } = interaction;

    const command = commandHandler.commands.get(commandName);
    if (!command || !command.autoComplete) return;

    const focused = interaction.options.getFocused(true);
    const choices = await command.autoComplete(interaction, command, focused.name);

    const filtered = choices.filter((choice) => choice.toLowerCase().startsWith(focused.value.toLowerCase())).slice(0, 25);

    interaction.respond(
        filtered.map(choice => ({
                name: choice,
                value: choice,
            }))
    );
}
import { ButtonInteraction, Client, StringSelectMenuInteraction } from "discord.js";
import buttons from "~/lists/buttons";
import { Button } from "~/types/objects";

export default async (client: Client, interaction: ButtonInteraction | StringSelectMenuInteraction) => {
    if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;
    if (!interaction.guild) return;

    const customId = interaction.customId;
    const argsAndId = customId.split("-");
    const id = argsAndId[0];
    const args = argsAndId.slice(1);
    const button = buttons.get(id)
    if (!button) return;

    try {
        if (!button.noDefer) {
            await interaction[button.deferReply ? 'deferReply' : 'deferUpdate']({ ephemeral: button.ephemeral });
        }
        button.execute(interaction, args);
    } catch (err) {
        logger.error(`Error while executing button ${button.name}`);
        logger.error(err);
    }
}
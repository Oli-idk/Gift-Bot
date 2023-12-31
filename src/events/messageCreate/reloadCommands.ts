import { Client, Message, SlashCommandBuilder } from "discord.js";
import commands from "~/lists/commands";

const truncateString = (string: string, maxLength: number) =>
  string.length > maxLength ? `${string.substring(0, maxLength)}…` : string;

export default async (client: Client, message: Message) => {
  if (message.author.bot) return;
  if (message.author.id != process.env.OWNERID) return;

  if (message.content.toLowerCase() == `${client.user} reload`) {
    if (!client.application) return;
    if (!client.application.owner) await client.application.fetch();

    let cmds = [];
    for (let obj of commands) {
      const command = obj[1];
      logger.info(`Loading command ${command.name}`);

      const cmd = new SlashCommandBuilder()
        .setName(command.name!)
        .setDescription(truncateString(command.description, 99));
      if (command.options) command.options(cmd);
      cmds.push(cmd);
    }
    await client.guilds.cache
      .get(process.env.GUILDID!)
      ?.commands.set(cmds);
    logger.info(`${cmds.length} commands loaded`);
    message.reply("Reloaded commands");
  }
};

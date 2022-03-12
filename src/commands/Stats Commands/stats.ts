import { mongoDB } from "../../functions/mongodb";
import { Command, RolesEnum } from "../../interfaces/Command";
import { User } from "../../types";
import moment from "moment";

export default {
  name: "stats",
  description: "Shows the amount of completed test and total time typing",
  category: "Stats",
  roles: [RolesEnum.MEMBER],
  run: async (interaction, client) => {
    const db = mongoDB();

    const user = <User | null>(
      await db.collection("users").findOne({ discordId: interaction.user.id })
    );

    if (user === null) return interaction.reply(":x: Could not find user");

    const duration = moment.duration({ seconds: user.timeTyping });

    const embed = client.embed({
      title: `Typing Stats for ${user.name}`,
      color: 0xe2b714,
      thumbnail: {
        url:
          "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/bar-chart_1f4ca.png"
      },
      fields: [
        {
          name: "Tests Started",
          value: user.startedTests.toString(),
          inline: false
        },
        {
          name: "Tests Completed",
          value: user.completedTests.toString(),
          inline: false
        },
        {
          name: "Test Completion Ratio",
          value: (
            (user.completedTests || 1) / (user.startedTests || 1)
          ).toFixed(2),
          inline: false
        },
        {
          name: "Time Typing",
          value: `${duration
            .hours()
            .toString()
            .padStart(2, "0")}:${duration
            .minutes()
            .toString()
            .padStart(2, "0")}:${duration
            .seconds()
            .toString()
            .padStart(2, "0")}`,
          inline: false
        }
      ],
      footer: {
        text: "www.monkeytype.com"
      }
    });

    interaction.reply({
      embeds: [embed]
    });
  }
} as Command;

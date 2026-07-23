import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

composer.callbackQuery("snippet:get", async (ctx) => {
  await ctx.answerCallbackQuery();
  const snippetNames = Object.keys(ctx.session.snippets);
  if (snippetNames.length === 0) {
    await ctx.editMessageText("No saved snippets. Use /save <name> <text> to create one.", {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
    });
    return;
  }
  await ctx.editMessageText(
    "To retrieve a snippet, use the command:\n\n/get <name>\n\nSaved snippets: " +
      snippetNames.join(", "),
    {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
    },
  );
});

composer.command("get", async (ctx) => {
  const text = ctx.message?.text ?? "";
  const name = text.slice("/get".length).trim().toLowerCase();
  if (!name) {
    const snippetNames = Object.keys(ctx.session.snippets);
    if (snippetNames.length === 0) {
      await ctx.reply("No saved snippets. Use /save <name> <text> to create one.");
      return;
    }
    await ctx.reply(
      "Usage: /get <name>\n\nSaved snippets: " + snippetNames.join(", "),
    );
    return;
  }

  const snippet = ctx.session.snippets[name];
  if (!snippet) {
    await ctx.reply(`Snippet "${name}" not found.`);
    return;
  }

  await ctx.reply(snippet.content);
});

export default composer;

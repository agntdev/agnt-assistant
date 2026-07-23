import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

composer.callbackQuery("snippet:list", async (ctx) => {
  await ctx.answerCallbackQuery();
  const snippetNames = Object.keys(ctx.session.snippets);
  if (snippetNames.length === 0) {
    await ctx.editMessageText("No saved snippets. Use /save <name> <text> to create one.", {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
    });
    return;
  }
  await ctx.editMessageText("Saved snippets:\n\n" + snippetNames.map((n) => `• ${n}`).join("\n"), {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
  });
});

composer.command("list_saves", async (ctx) => {
  const snippetNames = Object.keys(ctx.session.snippets);
  if (snippetNames.length === 0) {
    await ctx.reply("No saved snippets. Use /save <name> <text> to create one.");
    return;
  }
  await ctx.reply("Saved snippets:\n\n" + snippetNames.map((n) => `• ${n}`).join("\n"));
});

export default composer;

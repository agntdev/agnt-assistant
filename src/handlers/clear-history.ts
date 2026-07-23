import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

composer.callbackQuery("history:clear", async (ctx) => {
  await ctx.answerCallbackQuery();
  const count = ctx.session.history.length;
  if (count === 0) {
    await ctx.editMessageText("Your conversation history is already empty.", {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
    });
    return;
  }
  ctx.session.history = [];
  await ctx.editMessageText(`Conversation history cleared (${count} messages removed).`, {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
  });
});

composer.command("clear_history", async (ctx) => {
  const count = ctx.session.history.length;
  if (count === 0) {
    await ctx.reply("Your conversation history is already empty.");
    return;
  }
  ctx.session.history = [];
  await ctx.reply(`Conversation history cleared (${count} messages removed).`);
});

export default composer;

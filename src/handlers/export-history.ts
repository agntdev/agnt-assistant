import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

function formatHistory(history: { text: string; isUser: boolean; timestamp: number }[]): string {
  if (history.length === 0) return "";
  return history
    .map((msg) => {
      const role = msg.isUser ? "You" : "Bot";
      const time = new Date(msg.timestamp).toLocaleString();
      return `[${time}] ${role}: ${msg.text}`;
    })
    .join("\n\n");
}

composer.callbackQuery("history:export", async (ctx) => {
  await ctx.answerCallbackQuery();
  if (ctx.session.history.length === 0) {
    await ctx.editMessageText("No conversation history to export.", {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
    });
    return;
  }
  const formatted = formatHistory(ctx.session.history);
  await ctx.editMessageText(formatted, {
    reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
  });
});

composer.command("export_history", async (ctx) => {
  if (ctx.session.history.length === 0) {
    await ctx.reply("No conversation history to export.");
    return;
  }
  const formatted = formatHistory(ctx.session.history);
  await ctx.reply(formatted);
});

export default composer;

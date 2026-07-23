import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { mainMenuKeyboard, registerMainMenuItem } from "../toolkit/index.js";

registerMainMenuItem({ label: "🗑 Clear History", data: "history:clear", order: 10 });
registerMainMenuItem({ label: "📤 Export History", data: "history:export", order: 20 });
registerMainMenuItem({ label: "💾 Save Snippet", data: "snippet:save", order: 30 });
registerMainMenuItem({ label: "📋 Get Snippet", data: "snippet:get", order: 40 });
registerMainMenuItem({ label: "📑 List Snippets", data: "snippet:list", order: 50 });

const composer = new Composer<Ctx>();

const WELCOME =
  "Welcome to your professional assistant.\n\n" +
  "Tap a button below to manage your conversation history, save and retrieve snippets, or view your settings.";

composer.command("start", async (ctx) => {
  const name = ctx.from?.first_name;
  if (name) {
    ctx.session.profile = {
      telegramId: ctx.from!.id,
      displayName: name,
    };
  }
  await ctx.reply(WELCOME, { reply_markup: mainMenuKeyboard() });
});

composer.callbackQuery("menu:main", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(WELCOME, { reply_markup: mainMenuKeyboard() });
});

export default composer;

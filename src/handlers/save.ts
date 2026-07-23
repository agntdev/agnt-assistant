import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const SNIPPET_LIMIT = 100;

const composer = new Composer<Ctx>();

composer.callbackQuery("snippet:save", async (ctx) => {
  await ctx.answerCallbackQuery();
  const snippetCount = Object.keys(ctx.session.snippets).length;
  if (snippetCount >= SNIPPET_LIMIT) {
    await ctx.editMessageText("Snippet limit reached (100). Please delete some before saving new ones.", {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
    });
    return;
  }
  await ctx.editMessageText(
    "To save a snippet, use the command:\n\n/save <name> <text>\n\nExample: /save greeting Hello, how can I help you?",
    {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
    },
  );
});

composer.command("save", async (ctx) => {
  const text = ctx.message?.text ?? "";
  const args = text.slice("/save".length).trim();
  if (!args) {
    const snippetCount = Object.keys(ctx.session.snippets).length;
    if (snippetCount >= SNIPPET_LIMIT) {
      await ctx.reply("Snippet limit reached (100). Please delete some before saving new ones.");
      return;
    }
    await ctx.reply("Usage: /save <name> <text>\n\nExample: /save greeting Hello, how can I help you?");
    return;
  }

  const spaceIdx = args.indexOf(" ");
  if (spaceIdx === -1) {
    await ctx.reply("Please provide both a name and content.\n\nUsage: /save <name> <text>");
    return;
  }

  const name = args.slice(0, spaceIdx).trim().toLowerCase();
  const content = args.slice(spaceIdx + 1).trim();

  if (!name) {
    await ctx.reply("Snippet name cannot be empty.");
    return;
  }
  if (!content) {
    await ctx.reply("Snippet content cannot be empty.");
    return;
  }

  const snippetCount = Object.keys(ctx.session.snippets).length;
  if (snippetCount >= SNIPPET_LIMIT && !ctx.session.snippets[name]) {
    await ctx.reply("Snippet limit reached (100). Please delete some before saving new ones.");
    return;
  }

  ctx.session.snippets[name] = {
    name,
    content,
    createdAt: Date.now(),
  };

  await ctx.reply(`Snippet "${name}" saved successfully.`);
});

export default composer;

import { Composer } from "grammy";
import type { Ctx } from "../bot.js";

const MAX_HISTORY = 50;

const composer = new Composer<Ctx>();

composer.on("message:text", async (ctx, next) => {
  ctx.session.history.push({
    text: ctx.message.text,
    isUser: true,
    timestamp: Date.now(),
  });

  if (ctx.session.history.length > MAX_HISTORY) {
    ctx.session.history = ctx.session.history.slice(-MAX_HISTORY);
  }

  return next();
});

export default composer;

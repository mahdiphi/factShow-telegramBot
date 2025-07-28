const bot = require("../bot");
const functions = require("./functions");

async function requireAdmin(msg, next) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const start = msg.text.startsWith("/");
  const status = await functions.checkMemberStatus(chatId, userId);
  if (status !== "creator" && status !== "administrator" && start) {
    await bot.sendMessage(chatId, "ادمین نیستی شیره مال :)");
    return;
  }
  await next();
}

bot.onText(/\/start/, async (msg) => {
  try {
    if (msg.chat.type === "private") {
      await bot.sendMessage(
        msg.chat.id,
        "به ربات فکت شو خوش اومدی. چه کنم برایت؟",
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "افزودن به گروه",
                  url: "https://t.me/FactShowPersianBot?startgroup=addgroup",
                },
              ],
            ],
          },
        }
      );
    } else {
      requireAdmin(msg, async () => {
        await bot.sendMessage(msg.chat.id, "سلام من برده شما هستم :)");
        await functions.checkAdminStatus(msg);
      });
    }
  } catch (error) {
    console.error("/start handler error:", error);
  }
});

bot.onText(/\/panel/, async (msg) => {
  requireAdmin(msg, async () => {
    try {
      await bot.sendMessage(msg.chat.id, "پنل کاربری ربات", {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "پنل", callback_data: "panel" },
              { text: "راهنما", callback_data: "help" },
            ],
            [{ text: "بستن", callback_data: "exit" }],
          ],
        },
      });
    } catch (error) {
      console.error("/panel handler error:", error);
    }
  });
});

bot.on("message", async (msg) => {
  requireAdmin(msg, async () => {
    try {
      const chatId = msg.chat.id;
      const userId = msg.chat.id;
      if (!msg.text) return;

      const isBanCommand = msg.text.startsWith("/ban");
      const isUnbanCommand = msg.text.startsWith("/unban");

      if ((isBanCommand || isUnbanCommand) && msg.reply_to_message?.from) {
        const targetId = msg.reply_to_message.from.id;
        const status = await functions.checkMemberStatus(chatId, targetId);
        console.log("status:", status);

        if (isBanCommand && status === "member") {
          await bot.banChatMember(chatId, targetId);
          return bot.sendMessage(chatId, "کاربر بن شد.");
        }

        if (isUnbanCommand && status === "kicked") {
          await bot.unbanChatMember(chatId, targetId);
          return bot.sendMessage(chatId, "کاربر آنبن شد.");
        }
      } else if ((isBanCommand || isUnbanCommand) && functions.checkMemberStatus(chatId, userId) !== "member") {
        return bot.sendMessage(chatId, "باید روی پیام کاربر ریپلای بزنی تا بتونم بن یا آنبن کنم.");
      }
    } catch (error) {
      console.log("/ban handler error:", error);
    }
  });
});


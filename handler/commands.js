const bot = require("../bot");
const functions = require("./functions");
// const permissions = require("../states/permissions");

async function requireAdmin(msg, next) {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const isStart = msg.text ? msg.text.startsWith("/") : false;
  const status = await functions.checkMemberStatus(chatId, userId);
  if (status !== "creator" && status !== "administrator" && isStart) {
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
              [{text: "کلمات فیلتر شده", callback_data: "add-words"}],
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
      const userId = msg.from.id;
      if (!msg.text) return;

      const isBanCommand = msg.text.startsWith("/ban");
      const isUnbanCommand = msg.text.startsWith("/unban");
      const isMuteCommand = msg.text.startsWith("/mute");
      const isUnMuteCommand = msg.text.startsWith("/unmute");

      if (
        (isBanCommand || isUnbanCommand || isMuteCommand || isUnMuteCommand) &&
        msg.reply_to_message?.from
      ) {
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
        if (isMuteCommand && status === "member") {
          await bot.restrictChatMember(chatId, targetId, {
            // permissions: {
            can_send_messages: false,
            // }
          });
          return bot.sendMessage(chatId, "کاربر میوت شد.");
        }
        if (isUnMuteCommand && status === "restricted") {
          await bot.restrictChatMember(chatId, targetId, {
            can_send_messages: true,
            can_send_media_messages: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true,
            can_invite_users: true,
            can_change_info: false,
            can_pin_messages: false,
          });
          return bot.sendMessage(chatId, "کاربر از میوت خارج شد.");
        }

      } else if (
        (isBanCommand || isUnbanCommand || isMuteCommand || isUnMuteCommand) &&
        functions.checkMemberStatus(chatId, userId) !== "member"
      ) {
        return bot.sendMessage(
          chatId,
          "باید روی پیام کاربر ریپلای بزنی تا بتونم بن یا آنبن کنم."
        );
      }
    } catch (error) {
      console.log("/ban handler error:", error);
    }
  });
});

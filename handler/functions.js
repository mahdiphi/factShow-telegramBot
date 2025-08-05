const bot = require("../bot");
const userState = require("../states/userState");
const { initUserState } = require("../core/userStateHelper");
const { handleWords } = require("../states/badWords");

async function checkAdminStatus(msg) {
  try {
    if (!msg.chat || !msg.chat.id) return;

    const me = await bot.getMe();
    const botId = me.id;
    const status = await bot.getChatMember(msg.chat.id, botId);

    if (status.status === "administrator" || status.status === "creator") {
      await bot.sendMessage(
        msg.chat.id,
        "حال که ادمین شدم بریم جلو \n /start /panel",
        {
          entities: [
            { offset: 28, length: 6, type: "bot_command" },
            { offset: 35, length: 6, type: "bot_command" },
          ],
        }
      );
    } else {
      await bot.sendMessage(msg.chat.id, "سید من باید ادمین بشم");
    }
  } catch (error) {
    console.error("checkAdminStatus error:", error);
  }
}

async function showMainMenu(chatId, message_id) {
  try {
    await bot.editMessageText("پنل کاربری ربات", {
      chat_id: chatId,
      message_id: message_id,
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
}

async function showPanel(chatId, messageId) {
  const settings = initUserState(chatId);
  await bot.editMessageText("✅ این بخش پنل رباته.", {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: {
      inline_keyboard: [
        [
          { text: "حذف پیام", callback_data: "delete" },
          {
            text: `ضد اسپم ${settings.isSpam ? "✅" : "❌"}`,
            callback_data: "anti-spam",
          },
        ],
        [{ text: "فیلتر کلمات", callback_data: "filter" }],
        [{ text: "بازگشت ⬅️", callback_data: "backToMainMenu" }],
      ],
    },
  });
}
async function ShowDelete(chatId, messageId) {
  const settings = initUserState(chatId);

  await bot.editMessageText("بخش حذف خودکار پیام‌ها", {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: `لینک‌ها ${settings.isLinks ? "✅" : "❌"}`,
            callback_data: "toggle_links",
          },
          {
            text: `فورواردها ${settings.isForwarded ? "✅" : "❌"}`,
            callback_data: "toggle_forwarded",
          },
        ],
        [{ text: "بازگشت ⬅️", callback_data: "backToPanel" }],
      ],
    },
  });
}
const exit = async (chatId, messageId) => {
  await bot.editMessageText("پنل ربات بسته شد.", {
    chat_id: chatId,
    message_id: messageId,
  });
};

const checkMemberStatus = async (chatId, userId) => {
  try {
    const member = await bot.getChatMember(chatId, userId);
    return member.status;
  } catch (err) {
    console.error("getChatMember error:", err.message);
    return null;
  }
};

const badWords = async (chatId, messageId) => {
  const settings = handleWords(chatId);
  try {
    await bot.editMessageText("بخش فیلتر کلمات", {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: ` فیلتر کلمات ${settings.enabled ? "✅" : "❌"}`,
              callback_data: "isFilter",
            },
            { text: "اضافه کردن", callback_data: "words" },
          ],
          [{ text: "بازگشت ⬅️", callback_data: "backToPanel" }],
        ],
      },
    });
  } catch (error) {
    console.error("filterWords error:", err.message);
  }
};

module.exports = {
  checkAdminStatus,
  showMainMenu,
  showPanel,
  ShowDelete,
  exit,
  checkMemberStatus,
  badWords,
};

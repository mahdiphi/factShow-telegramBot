const userState = require("../states/userState");
const bot = require("../bot");
const functions = require("./functions");
const { initUserState } = require("../core/userStateHelper");
const { handleWords, updateFilterWords } = require("../states/badWords");

bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const data = query.data;
    const settings = initUserState(chatId);
    const words = handleWords(chatId);

    const message_id = query.message.message_id;

    switch (data) {
      case "panel":
        await functions.showPanel(chatId, message_id);
        break;

      case "delete":
        await functions.ShowDelete(chatId, message_id);
        break;

      case "backToPanel":
        await functions.showPanel(chatId, message_id);
        break;

      case "backToMainMenu":
        await functions.showMainMenu(chatId, message_id);
        break;
      case "toggle_links":
        settings.isLinks = !settings.isLinks;
        break;
      case "toggle_forwarded":
        settings.isForwarded = !settings.isForwarded;
        break;
      case "anti-spam":
        settings.isSpam = !settings.isSpam;
        console.log(settings.isSpam);
        break;
        case "filter":
          await functions.badWords(chatId, message_id);
          break;
      case "help":
        break;
      case "exit":
        await functions.exit(chatId, message_id);
        break;
    }

    if (data === "toggle_links" || data === "toggle_forwarded") {
      await bot.editMessageReplyMarkup(
        {
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
        {
          chat_id: chatId,
          message_id: query.message.message_id,
        }
      );
    }

    if (data === "anti-spam") {
      bot.editMessageReplyMarkup(
        {
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
        {
          chat_id: chatId,
          message_id: query.message.message_id,
        }
      );
    }

if (data === "isFilter") {
  const settings = handleWords(chatId);

  settings.enabled = !settings.enabled;

  updateFilterWords(chatId, settings);

  await bot.editMessageText("بخش فیلتر کلمات", {
    chat_id: chatId,
    message_id: query.message.message_id,
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
}





    if (data === "add-words") {
      bot.editMessageText(
        "برای اضافه کردن کلمات به پی وی بات برو و کامند /addwords رو بزن.",
        {
          chat_id: chatId,
          message_id: query.message.message_id,
          reply_markup: {
            inline_keyboard: [
              [{ text: "بازگشت ⬅️", callback_data: "isFilter" }],
            ],
          },
        }
      );
    }

    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error("callback_query error:", error);
  }
});

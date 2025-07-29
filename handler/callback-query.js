const userState = require("../states/userState")
const bot = require("../bot");
const functions = require("./functions")

bot.on("callback_query", async (query) => {
  try {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (!userState[chatId]) {
      userState[chatId] = { isLinks: false, isForwarded: false };
    }

    const settings = userState[chatId];
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
      case "help":
        await bot.sendMessage(
          chatId,
          "📘 برای استفاده از ربات، از این دکمه‌ها کمک بگیر."
        );
        break;
        case "exit":
          await functions.exit(chatId, message_id)
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
            [{ text: "بازگشت ⬅️", callback_data: "backToPanel" }]
          ],
        },
        {
          chat_id: chatId,
          message_id: query.message.message_id,
        }
      );
    }

    await bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error("callback_query error:", error);
  }
});
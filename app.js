const axios = require("axios");
const functions = require("./handler/functions");
const userState = require("./states/userState");
const bot = require("./bot");
const handleCallbackQuery = require("./handler/callback-query");
const handleCommands = require("./handler/commands");
const handleMessages = require("./handler/message-handler")

bot.on("my_chat_member", functions.checkAdminStatus);

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (!userState[chatId]) {
    userState[chatId] = { isLinks: false, isForwarded: false };
  }

  const text = msg.text;
  const settings = userState[chatId];

  // Welcome new members
  if (msg.new_chat_members) {
    const user = msg.new_chat_members[0];
    const name = user.first_name;
    const id = user.id;
    const message = `سلام <a href="tg://user?id=${id}">${name}</a> به گپ ما خوش اومدی!`;
    return bot.sendMessage(chatId, message, { parse_mode: "HTML" });
  }

  // Delete links if enabled
  if (
    settings.isLinks &&
    text &&
    /https?:\/\/|t\.me/.test(text) &&
    !text.includes(`t.me/${msg.chat.username}`) &&
    !text.includes(`t.me/c/${String(chatId).replace("-100", "")}`)
  ) {
    if (memberStatus === "creator" || memberStatus === "administrator") {
      return;
    } else {
      try {
        await bot.deleteMessage(chatId, msg.message_id);
        return;
      } catch (e) {
        console.log("Error deleting link message:", e.message);
      }
    }
  }
  // Delete forwarded messages if enabled
  if (settings.isForwarded) {
    try {
      if (
        msg.forward_date ||
        msg.forward_from ||
        (msg.forward_from_chat &&
          String(msg.forward_from_chat.id) !== String(chatId))
      ) {
        if (memberStatus === "creator" || memberStatus === "administrator")
          return;
        else await bot.deleteMessage(chatId, msg.message_id);
      }
    } catch (err) {
      console.log("Error deleting forwarded message:", err.message);
    }
  }
});

handleCommands;

handleCallbackQuery;

bot.on("polling_error", (error) => {
  console.log("[polling_error]", error.code, error.message);
});

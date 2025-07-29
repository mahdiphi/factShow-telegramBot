const bot = require("../bot");
const userState = require("../states/userState");
const antiSpam = require("../states/anti-spam");

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const name = msg.from.first_name;
  const date = msg.date;

  if (!antiSpam[userId]) {
    antiSpam[userId] = { timestamps: [], warnings: 0 };
  }

  const userData = antiSpam[userId];
  userData.timestamps.push(date);

  userData.timestamps = userData.timestamps.filter((ts) => date - ts <= 5);

  if (userData.timestamps.length >= 5) {
    userData.warnings++;
    const message = `کاربر <a href="tg://user?id=${userId}">${name}</a> شما 1 اخطار دریافت کردی!`;
    bot.sendMessage(chatId, message, { parse_mode: "HTML" });

    if (userData.warnings === 3) {
      bot.restrictChatMember(chatId, userId, {
        can_send_messages: false,
      });

      const message = `کاربر <a href="tg://user?id=${userId}">${name}</a> شما به دلیل اسپم و بی‌توجهی به اخطارها، میوت شدی!`;
      bot.sendMessage(chatId, message, { parse_mode: "HTML" });

      setTimeout(() => {
        bot.restrictChatMember(chatId, userId, {
            can_send_messages: true,
            can_send_media_messages: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true,
            can_change_info: false,
            can_invite_users: true,
            can_pin_messages: false,
          },
        );
        
        console.log(`User ${userId} is unmuted.`);
        const message2 = `کاربر <a href="tg://user?id=${userId}">${name}</a> آن میوت شدی نبینم دیگه اسپم کنی :)`;
        bot.sendMessage(chatId, message2, { parse_mode: "HTML" });
      }, 10000);
    }
  }

  console.log(antiSpam[userId]);

  //   const date = new Date(msg.date * 1000);
  //   console.log(date.toString());
});

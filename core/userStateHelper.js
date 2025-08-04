const userState = require("../states/userState");

function initUserState(chatId) {
  if (!userState[chatId]) userState[chatId] = {};

  const defaultState = {
    isLinks: false,
    isForwarded: false,
    isSpam: false,
  };

  for (const key in defaultState) {
    if (userState[chatId][key] === undefined) {
      userState[chatId][key] = defaultState[key];
    }
  }

  return userState[chatId];
}

module.exports = { initUserState };

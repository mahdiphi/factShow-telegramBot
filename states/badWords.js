const { getFilterWords, saveFilterWords } = require("../fileStorage");

function handleWords(chatId) {
  const settings = getFilterWords(chatId);
  return settings;
}

function updateFilterWords(chatId, settings) {
  saveFilterWords(chatId, settings);
}

module.exports = { handleWords, updateFilterWords };

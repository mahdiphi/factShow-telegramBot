const fs = require("fs");

const wordsFilePath = "./filterWords.json";

function loadData() {
  try {
    const data = fs.readFileSync(wordsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or parsing data:", error.message);
    return {};
  }
}

function getFilterWords(chatId) {
  const data = loadData();
  if (!data[chatId]) {
    data[chatId] = { enabled: false, words: [] };
  }
  return data[chatId];
}

function saveFilterWords(chatId, settings) {
  const data = loadData();
  data[chatId] = settings;
  fs.writeFileSync(wordsFilePath, JSON.stringify(data, null, 2));
}

module.exports = { getFilterWords, saveFilterWords };

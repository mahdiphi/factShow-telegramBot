const filterWords = {};
function handleWords(chatId) {
  if (!filterWords[chatId]) filterWords[chatId] = {};

  const defaultState = {
    enabled: false,
    words: ["mmd", "ali", "samad"],
  };

  for (const key in defaultState) {
    if (filterWords[chatId][key] === undefined) {
      filterWords[chatId][key] = defaultState[key];
    }
  }

  return filterWords[chatId];
}

module.exports = {handleWords}
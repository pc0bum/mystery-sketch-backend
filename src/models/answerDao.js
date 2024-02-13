const appDataSource = require("../models/dataSource");

const getAnswer = async () => {
    const words = await getRandomWords(1);

    const randomIndex = Math.floor(Math.random() * words.length);
    const selectedWord = words[randomIndex];

    return selectedWord;
};

async function getRandomWords(count) {
    const query = `
        SELECT *
        FROM word
        ORDER BY RAND()
        LIMIT ${count};
    `;

    const result = await appDataSource.query(query);

    return result;
}

module.exports = {
    getAnswer,
};


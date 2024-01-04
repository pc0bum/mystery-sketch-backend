const appDataSource = require("../models/dataSource")

const getAnswer = async () => {
    return await appDataSource.query(`
    SELECT
    *
    FROM word
    ORDER BY RAND() LIMIT 10;
    `)
}

module.exports = {
    getAnswer
}

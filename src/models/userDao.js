const appDataSource = require("../models/dataSource")

const joinRoom = async (nickname, profileImage) => {
    return await appDataSource.query(`
    INSERT INTO users
    (username, profile_image_id)
    VALUES (?, ?);
    `,
    [nickname, profileImage]
    )
}

module.exports = {
    joinRoom
}
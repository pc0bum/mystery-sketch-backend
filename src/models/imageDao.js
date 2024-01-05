const appDataSource = require("../models/dataSource");

const getProfileImage = async () => {
  return await appDataSource.query(`
    SELECT
    *
    FROM profile_image
    `);
};

module.exports = {
  getProfileImage,
};

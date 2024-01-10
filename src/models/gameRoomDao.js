const appDataSource = require("./dataSource");

const getGameroomInfo = async (roomId) => {
  return await appDataSource.query(
  `
  SELECT
  rooms.id AS room_id,
  rooms.max_players,
  rooms.time,
  rooms.round,
  rooms.is_private,
JSON_UNQUOTE(
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'enrolled_id', enrolled_players.id,
      'users_id', enrolled_players.users_id,
      'username', users.username,
      'score', users.score,
      'isAdmin', users.isAdmin,
      'image_link', profile_image.image_link
    )
  )
) AS users
FROM
  rooms
JOIN
  enrolled_players ON rooms.id = enrolled_players.rooms_id
JOIN
  users ON enrolled_players.users_id = users.id
JOIN
  profile_image ON users.profile_image_id = profile_image.id
WHERE
  rooms.id = ?
GROUP BY
  rooms.id, rooms.max_players, rooms.time, rooms.round, rooms.is_private;
    `,
  roomId
  );
};

module.exports = {
  getGameroomInfo,
};

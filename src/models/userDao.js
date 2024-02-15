const appDataSource = require("../models/dataSource");

const userDao = {
  signUp: async (nickname, profileImage) => {
    try {
      return await appDataSource.query(
        `
                INSERT INTO users
                (username, profile_image_id)
                VALUES (?, ?);
            `,
        [nickname, profileImage]
      );
    } catch (error) {
      throw new Error("Error signing up user");
    }
  },

  joinRoom: async (userId, roomId) => {
    try {
      const query =
        "INSERT INTO enrolled_players (users_id, rooms_id) VALUES (?, ?)";
      await appDataSource.query(query, [userId, roomId]);
    } catch (error) {
      throw new Error("Error joining user to room");
    }
  },

  getEnrolledPlayersCount: async (roomId) => {
    try {
      const query =
        "SELECT COUNT(*) AS count FROM enrolled_players WHERE rooms_id = ?";
      return await appDataSource.query(query, [roomId]);
    } catch (error) {
      throw new Error("Error fetching enrolled players count");
    }
  },

  getRoomMaxPlayers: async (roomId) => {
    try {
      const query = "SELECT max_players FROM rooms WHERE id = ?";
      return await appDataSource.query(query, [roomId]);
    } catch (error) {
      throw new Error("Error fetching room max players");
    }
  },

  getExistingRooms: async () => {
    try {
      const query = "SELECT id FROM rooms WHERE is_private = 0 ";
      return await appDataSource.query(query);
    } catch (error) {
      throw new Error("Error fetching existing rooms");
    }
  },
  updateUserRole: async (userId) => {
    try {
      const query = "UPDATE users SET isAdmin = 1 WHERE id = ?";
      return await appDataSource.query(query, userId);
    } catch (error) {
      throw new Error("Error fetching Update User Role");
    }
  },

  createRoom: async () => {
    try {
      const query =
        "INSERT INTO rooms (max_players, time, round, is_private, created_at) VALUES (DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT);";
      return await appDataSource.query(query);
    } catch {
      throw new Error("Error fetching create room");
    }
  },

  secretSignUp: async (nickname, profileImage) => {
    try {
      return await appDataSource.query(
        `
        INSERT INTO users
        (username, profile_image_id, isAdmin)
        VALUES (?, ?, 1);
        `,
        [nickname, profileImage]
      );
    } catch (error) {
      throw new Error("Error signing up user");
    }
  },

  secretCreateRoomByUserValue: async (maxPlayers, time, round) => {
    try {
      const query =
        "INSERT INTO rooms (max_players, time, round, is_private, created_at) VALUES (?, ?, ?, 1, DEFAULT);";
      return await appDataSource.query(query, [maxPlayers, time, round]);
    } catch {
      throw new Error("Error fetching create room");
    }
  },

  doubleCheckNickname: async (nickname) => {
    try {
      const result = await appDataSource.query(
        `SELECT * FROM users WHERE username = ?`,
        [nickname]
      );
      if (result.length === 0) {
        return "USERNAME_NOT_FOUND";
      }
      console.log(result[0].username);
      return result[0].username;
    } catch (error) {
      throw new Error("Error fetching double check");
    }
  },

  getUserIdByUsername: async (username) => {
    try {
      const result = await appDataSource.query(
        `SELECT * FROM users WHERE username = ?`,
        [username]
      );
      return result[0].id;
    } catch (error) {
      throw new Error("Error fetching user id");
    }
  },
  deleteUserFromDatabase: async (userId) => {
    try {
      const result = await appDataSource.query(
        `DELETE FROM users WHERE id = ?`,
        [userId]
      );
      return "DELETED SUCCESSFUL";
    } catch (error) {
      throw new Error("Error fetching delete user id");
    }
  },
  deleteEnrolledPlayers: async (userId) => {
    try {
      const result = await appDataSource.query(
        `DELETE FROM enrolled_players where users_id = ?`,
        [userId]
      );
      return "DELETED SUCCESSFUL";
    } catch (error) {
      throw new Error("Error fetching delete enrolled_players");
    }
  },
  getUserPoint: async (username) => {
    try {
      const result = await appDataSource.query(
        `SELECT * FROM users WHERE username = ?`,
        [username]
      );
      console.log(`가져온 유저 포인트 : ${result[0].score}`);
      return result[0].score;
    } catch (error) {
      throw new Error("Error fetching getUserPoint");
    }
  },
  updateUserPoint: async (username, point) => {
    try {
      const result = await appDataSource.query(
        `UPDATE users SET score = ? WHERE username = ?`,
        [point, username]
      );
      return "POINT UPDATED SUCCESSFUL";
    } catch (error) {
      throw new Error("Error updating user point");
    }
  },
};

module.exports = userDao;

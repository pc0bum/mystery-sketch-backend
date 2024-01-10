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

  secretCreateRoomByDefaultValue: async () => {
    try {
      const query =
        "INSERT INTO rooms (max_players, time, round, is_private, created_at) VALUES (DEFAULT, DEFAULT, DEFAULT, 1, DEFAULT);";
      return await appDataSource.query(query);
    } catch {
      throw new Error("Error fetching create room");
    }
  },
};

module.exports = userDao;

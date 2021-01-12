const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validatePlayerInput,
  validateLoginInput,
} = require("../../util/validatiors");
const { SECRET_KEY } = require("../../config");
const Match = require("../../models/Match");

function generateToken(player, matchId) {
  return jwt.sign(
    {
      id: player.id,
      nick: player.nick,
      matchId,
    },
    SECRET_KEY,
    { expiresIn: "24h" }
  );
}

module.exports = {
  Mutation: {
    /*async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong crendetials";
        throw new UserInputError("Wrong crendetials", { errors });
      }

      const token = generateToken(user, gameCode);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },*/
    async joinMatch(_, { gameCode, nick }) {
      // Validate player data
      const { valid, errors } = validatePlayerInput(nick);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      let match = await Match.find({ gameCode });
      match = match[0];
      if (match) {
        // Couldn't get .find() to work
        // this code checks if Nick is taken. (-1 means that it doesn't exist in the array)
        const checkNick = match.players.findIndex((c) => c.nick === nick);
        if (checkNick === -1) {
          // Creates an shuffles game array
          let boxOrder = [];
          for (let i = 0; i < 25; i++) {
            boxOrder.push({
              placement: i,
              checked: false,
            });
          }
          boxOrder = boxOrder.sort(() => Math.random() - 0.5);

          match.players.unshift({
            nick,
            finishedAt: "",
            boxOrder,
          });
          const res = await match.save();
          // Use the res to add token, then return

          console.log(res);

          return match;
        } else {
          throw new UserInputError("Nick upptaget", { errors });
        }
      } else {
        throw new UserInputError("Felaktig kod", { errors });
      }
      /*
      no new player
      const newPlayer = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newPlayer.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
      */
    },
  },
};

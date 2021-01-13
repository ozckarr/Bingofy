const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { validatePlayerInput } = require("../../util/validatiors");
const { SECRET_KEY } = require("../../config");
const Match = require("../../models/Match");
const Player = require("../../models/Player");

function generateToken(player) {
  return jwt.sign(
    {
      id: player.id,
      nick: player.nick,
      matchId: player.gameId,
    },
    SECRET_KEY,
    { expiresIn: "24h" }
  );
}

module.exports = {
  Mutation: {
    async joinMatch(_, { gameCode, nick }) {
      // Validate nick data
      const { valid, errors } = validatePlayerInput(nick);
      if (!valid) {
        throw new UserInputError("Otillåtet Nick", { errors });
      }

      // Make sure that the nick is not used
      let match = await Match.find({ gameCode });
      match = match[0];

      //
      /* TODO: Använd filter(?) på Player med {match.id}. Använd array med find
      const user = await Player.findOne({ username });
      if (user) {
        throw new UserInputError("Nick är taget", {
          errors: {
            username: "This nick is taken",
          },
        });
      }*/
      if (match) {
        let playerList = await Player.filter(player, { matchId: match.id });
        if (playerList) {
          console.log(playerList);
        }
      }

      // Creates an shuffles game array
      let boxOrder = [];
      for (let i = 0; i < 25; i++) {
        boxOrder.push({
          placement: i,
          checked: false,
        });
      }
      boxOrder = boxOrder.sort(() => Math.random() - 0.5);

      const newPlayer = new Player({
        nick,
        finishedAt: "",
        gameCode,
        matchId: match.id,
        boxOrder,
      });

      const res = await newPlayer.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};

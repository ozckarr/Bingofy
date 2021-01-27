const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { validatePlayerInput } = require("../../util/validatiors");
const Match = require("../../models/Match");

function generateToken(match) {
  return jwt.sign(
    {
      playerId: match.players[0]._id,
      nick: match.players[0].nick,
      bingoId: match.bingoId,
      matchId: match.id,
    },
    process.env.SECRET_KEY,
    { expiresIn: "168h" }
  );
}

module.exports = {
  Mutation: {
    async joinMatch(_, { gameCode, nick }) {
      // Validate nick data
      const { valid, errors } = validatePlayerInput(gameCode, nick);
      if (!valid) {
        throw new UserInputError("Otillåtet namn", { errors });
      }

      let match = await Match.find({ gameCode });
      match = match[0];

      if (match) {
        if (match.finishedAt !== "") {
          throw new UserInputError("Finished match", {
            errors: {
              gameCode: "Matchen är redan påbörjad eller klar",
            },
          });
        }

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

          const token = generateToken(res);

          return {
            ...res._doc,
            id: res._id,
            token,
          };
        } else {
          throw new UserInputError("Username is taken", {
            errors: {
              nick: "Upptaget namn",
            },
          });
        }
      } else {
        throw new UserInputError("Nonexistent code", {
          errors: {
            gameCode: "fel kod",
          },
        });
      }
    },
  },
};

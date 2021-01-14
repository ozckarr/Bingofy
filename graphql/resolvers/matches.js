const { UserInputError } = require("apollo-server");

const Match = require("../../models/Match");
const checkAuth = require("../../util/check-auth");

//TODO delete match

module.exports = {
  Query: {
    async getMatch(_, { matchId }) {
      try {
        const match = await Match.findById(matchId);
        if (match) {
          return match;
        } else {
          throw new UserInputError("Felaktig kod");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createMatch(_, { bingoId }, context) {
      const user = checkAuth(context);

      var gameCode = "";
      var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 5; i++)
        gameCode += possible.charAt(
          Math.floor(Math.random() * possible.length)
        );

      const newMatch = new Match({
        gameCode,
        bingoId,
        userId: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const match = await newMatch.save();

      return match;
    },
  },
};

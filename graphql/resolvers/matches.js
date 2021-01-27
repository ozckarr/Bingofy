const { UserInputError } = require("apollo-server");

const Match = require("../../models/Match");
const checkAuth = require("../../util/check-auth");

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
    async createMatch(_, { bingoId, bingoName }, context) {
      const user = checkAuth(context);

      //creates randomized code
      var gameCode = "";
      var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 6; i++) {
        gameCode += possible.charAt(
          Math.floor(Math.random() * possible.length)
        );
      }

      const newMatch = new Match({
        gameCode,
        bingoId,
        bingoName,
        userId: user.id,
        finishedAt: "",
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const match = await newMatch.save();

      return match;
    },
    checkBingoBox: async (_, { matchId, playerId, bingoBoxId }) => {
      const match = await Match.findById(matchId);

      if (match) {
        const pIndex = match.players.findIndex((i) => i.id === playerId);

        const bIndex = match.players[pIndex].boxOrder.findIndex(
          (i) => i.id === bingoBoxId
        );

        //Toggles the check/unchecked box
        match.players[pIndex].boxOrder[bIndex].checked = !match.players[pIndex]
          .boxOrder[bIndex].checked;
        await match.save();

        return match;
      }
    },
    bingoConfirm: async (_, { matchId, playerId }) => {
      const match = await Match.findById(matchId);

      if (match) {
        if (match.finishedAt === "") {
          match.finishedAt = new Date().toISOString();
        }

        const index = match.players.findIndex((i) => i.id === playerId);

        // Prevents player from changing finish-time
        if (match.players[index].finishedAt === "") {
          match.players[index].finishedAt = new Date().toISOString();
        }

        await match.save();

        return match;
      }
    },
    async getHighscore(_, { gameCode }) {
      try {
        let match = await Match.find({ gameCode });
        match = match[0];

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
};

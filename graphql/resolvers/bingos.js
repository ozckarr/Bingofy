const { AuthenticationError, UserInputError } = require("apollo-server");

const Bingo = require("../../models/Bingo");
const Match = require("../../models/Match");

const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getBingos() {
      try {
        const bingos = await Bingo.find().sort({ createdAt: -1 });
        return bingos;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getBingo(_, { bingoId }) {
      try {
        const bingo = await Bingo.findById(bingoId);
        if (bingo) {
          return bingo;
        } else {
          throw new Error("Bingo not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getBingoWithGameCode(_, { matchId }) {
      try {
        const match = await Match.findById(matchId);
        if (match) {
          const bingo = await Bingo.findById(match.bingoId);
          if (bingo) {
            return bingo;
          } else {
            throw new Error("Bingo not found");
          }
        } else {
          throw new Error("Bingo not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createBingo(_, { title, description }, context) {
      const user = checkAuth(context);

      if (title.trim() === "") {
        throw new UserInputError("Ingen titel", { errors });
      }

      const newBingo = new Bingo({
        title,
        description,
        createdAt: new Date().toISOString(),
        username: user.username,
      });

      const bingo = await newBingo.save();

      return bingo;
    },
    async deleteBingo(_, { bingoId }, context) {
      const user = checkAuth(context);

      try {
        const bingo = await Bingo.findById(bingoId);
        if (user.username === bingo.username) {
          await bingo.delete();
          return "Bingo deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

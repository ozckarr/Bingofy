const { UserInputError } = require("apollo-server");

const checkAuth = require("../../util/check-auth");
const Bingo = require("../../models/Bingo");

module.exports = {
  Mutation: {
    createBingoBox: async (_, { bingoId, title, summery }) => {
      if (title.trim() === "") {
        throw new UserInputError("Behöver en titel", {
          errors: {
            title: "Bingo Box can't be empty",
          },
        });
      }

      const bingo = await Bingo.findById(bingoId);

      if (bingo) {
        bingo.bingoBoxes.unshift({
          title,
          summery,
          checked: false,
        });
        await bingo.save();
        return bingo;
      } else throw new UserInputError("Kunde inte hitta bingot");
    },
  },
};

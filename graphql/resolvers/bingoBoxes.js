const { UserInputError } = require("apollo-server");

const checkAuth = require("../../util/check-auth");
const Bingo = require("../../models/Bingo");

// CheckBingobox() is in matches.js
module.exports = {
  Mutation: {
    createBingoBox: async (_, { bingoId, title, summery, cloudinaryId }) => {
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
          cloudinaryId,
          checked: false,
        });
        await bingo.save();
        return bingo;
      } else throw new UserInputError("Kunde inte hitta bingot");
    },
    async deleteBingoBox(_, { bingoId, bingoBoxId }) {
      let bingo = await Bingo.findById(bingoId);
      if (bingo) {
        console.log(bingo);

        bingo.bingoBoxes.pull(bingoBoxId);

        await bingo.save();

        return "Bingobox deleted successfully";
      } else throw new UserInputError("Kunde inte ta bort boxen");
    },
  },
};

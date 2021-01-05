const { UserInputError } = require("apollo-server");

const checkAuth = require("../../util/check-auth");
const Bingo = require("../../models/Bingo");

module.exports = {
  Mutation: {
    createBingoBrick: async (_, { bingoId, placement, title, summery }) => {
      if (body.trim() === "") {
        throw new UserInputError("Behöver en titel", {
          errors: {
            body: "Bingo Brick can't be empty",
          },
        });
      }

      const bingo = await Bingo.findById(bingoId);

      if (bingo) {
        bingo.bingoBrick.unshift({
          placement,
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

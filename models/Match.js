const { model, Schema } = require("mongoose");

const matchSchema = new Schema({
  gameCode: String,
  bingoId: String,
  bingoName: String,
  createdAt: String,
  userId: String,
  username: String,
  finishedAt: String,
  players: [
    {
      nick: String,
      finishedAt: String,
      boxOrder: [
        {
          placement: String,
          checked: Boolean,
        },
      ],
    },
  ],
});

module.exports = model("Match", matchSchema);

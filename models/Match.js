const { model, Schema } = require("mongoose");

const matchSchema = new Schema({
  gameCode: String,
  bingoId: String,
  createdAt: String,
  userId: String,
  username: String,
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

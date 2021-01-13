const { model, Schema } = require("mongoose");

const playerSchema = new Schema({
  nick: String,
  finishedAt: String,
  matchId: String,
  gameCode: String,
  boxOrder: [
    {
      placement: String,
      checked: Boolean,
    },
  ],
});

module.exports = model("Player", playerSchema);

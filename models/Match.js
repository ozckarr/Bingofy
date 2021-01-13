const { model, Schema } = require("mongoose");

const matchSchema = new Schema({
  gameCode: String,
  bingoId: String,
  createdAt: String,
  userId: String,
  username: String,
});

module.exports = model("Match", matchSchema);

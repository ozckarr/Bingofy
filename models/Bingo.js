const { model, Schema } = require("mongoose");

const bingoSchema = new Schema({
  title: String,
  description: String,
  createdAt: String,
  username: String,
  bingoBoxes: [
    {
      title: String,
      summery: String,
      checked: Boolean,
    },
  ],
});

module.exports = model("Bingo", bingoSchema);

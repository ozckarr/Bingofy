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
      cloudinaryId: String,
    },
  ],
});

module.exports = model("Bingo", bingoSchema);

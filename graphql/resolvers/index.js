const usersResolvers = require("./users");
const bingosResolvers = require("./bingos");
const bingoBoxResolver = require("./bingoBoxes");
const matchesResolver = require("./matches");
const playersResolver = require("./players");

module.exports = {
  Query: {
    ...bingosResolvers.Query,
    ...matchesResolver.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...bingosResolvers.Mutation,
    ...bingoBoxResolver.Mutation,
    ...matchesResolver.Mutation,
    ...playersResolver.Mutation,
  },
};

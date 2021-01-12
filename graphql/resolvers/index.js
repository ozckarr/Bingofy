const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
const bingosResolvers = require("./bingos");
const bingoBoxResolver = require("./bingoBoxes");
const matchesResolver = require("./matches");
const playersResolver = require("./players");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
    ...bingosResolvers.Query,
    ...matchesResolver.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...bingosResolvers.Mutation,
    ...bingoBoxResolver.Mutation,
    ...matchesResolver.Mutation,
    ...playersResolver.Mutation,
  },
};

const { AuthenticationError, UserInputError } = require("apollo-server");

const Match = require("../../models/Match");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getMatches() {
      try {
        const matches = await Match.find().sort({ createdAt: -1 });
        return matches;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getMatch(_, { matchId }) {
      try {
        const match = await Match.findById(matchId);
        if (match) {
          return match;
        } else {
          throw new Error("Match not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createMatch(_, { bingoId }, context) {
      const user = checkAuth(context);

      var gameCode = "";
      var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 5; i++)
        gameCode += possible.charAt(
          Math.floor(Math.random() * possible.length)
        );

      const newMatch = new Match({
        gameCode,
        bingoId,
        username: user.id,
        createdAt: new Date().toISOString(),
      });

      const match = await newMatch.save();

      return match;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // Post already likes, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },
  },
};

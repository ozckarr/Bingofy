const { gql } = require("apollo-server");

module.exports = gql`
  type Bingo {
    id: ID!
    title: String!
    description: String!
    createdAt: String!
    username: String!
    bingoBrick: [BingoBrick]!
  }
  type BingoBrick {
    id: ID!
    placement: String!
    title: String!
    summery: String
    checked: Boolean!
  }
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getBingos: [Bingo]
    getBingo(bingoId: ID!): Bingo
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createBingo(title: String!, description: String): Bingo!
    deleteBingo(bingoId: ID!): String!
    createBingoBrick(
      bingoId: String!
      placement: String!
      title: String!
      summery: String!
    ): Bingo!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
`;

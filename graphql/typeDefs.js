const { gql } = require("apollo-server");

module.exports = gql`
  type Bingo {
    id: ID!
    title: String!
    description: String!
    createdAt: String!
    username: String!
    bingoBoxes: [BingoBoxes]!
  }
  type BingoBoxes {
    id: ID!
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
  type Match {
    id: ID!
    gameCode: String!
    bingoId: String!
    createdAt: String!
    username: String!
    player: [Player]
  }
  type Player {
    id: ID!
    nick: String!
    finishedAt: String
    boxOrder: [BoxOrder]
  }
  type BoxOrder {
    placement: String
    checked: Boolean
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getBingos: [Bingo]
    getBingo(bingoId: ID!): Bingo
    getMatches: [Match]
    getMatch(matchId: ID!): Match
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createBingo(title: String!, description: String): Bingo!
    deleteBingo(bingoId: ID!): String!
    createBingoBox(bingoId: String!, title: String!, summery: String): Bingo!
    createComment(postId: String!, body: String!): Post!
    checkBingoBox(bingoId: String!, bingoBoxId: String!): Bingo!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    createMatch(bingoId: String!): Match!
  }
`;

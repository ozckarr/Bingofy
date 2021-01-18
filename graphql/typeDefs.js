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
    userId: String
    username: String!
    players: [Player]
    finishedAt: String
    token: String
  }
  type Player {
    id: ID!
    nick: String!
    finishedAt: String
    boxOrder: [BoxOrder]
  }
  type BoxOrder {
    id: ID!
    placement: String
    checked: Boolean
  }
  type Query {
    getBingos: [Bingo]
    getBingo(bingoId: ID!): Bingo
    getMatch(matchId: ID!): Match
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createBingo(title: String!, description: String): Bingo!
    deleteBingo(bingoId: ID!): String!
    createBingoBox(bingoId: String!, title: String!, summery: String): Bingo!
    checkBingoBox(
      matchId: String!
      playerId: String!
      bingoBoxId: String!
    ): Match!
    createMatch(bingoId: String!): Match!
    joinMatch(gameCode: String!, nick: String!): Match!
  }
`;

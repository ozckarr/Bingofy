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
    cloudinaryId: String
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
    bingoName: String!
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
    getBingoWithGameCode(matchId: String!): Bingo
    getMatch(matchId: ID!): Match
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createBingo(title: String!, description: String): Bingo!
    deleteBingo(bingoId: ID!): String!
    createBingoBox(
      bingoId: String!
      title: String!
      summery: String
      cloudinaryId: String
    ): Bingo!
    checkBingoBox(
      matchId: String!
      playerId: String!
      bingoBoxId: String!
    ): Match!
    deleteBingoBox(bingoId: String!, bingoBoxId: String!): String!
    bingoConfirm(matchId: String!, playerId: String!): Match!
    createMatch(bingoId: String!, bingoName: String!): Match!
    joinMatch(gameCode: String!, nick: String!): Match!
    getHighscore(gameCode: String!): Match
  }
`;

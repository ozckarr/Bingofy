import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export const FETCH_BINGOS_QUERY = gql`
  {
    getBingos {
      id
      title
      description
      createdAt
      username
      bingoBoxes {
        id
        title
        summery
        checked
      }
    }
  }
`;

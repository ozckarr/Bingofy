import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { Container, Loader } from "semantic-ui-react";

function HighscoreView(props) {
  const matchId = props.match.params.matchId;

  const { loading, data } = useQuery(FETCH_MATCH_QUERY, {
    variables: {
      matchId,
    },
  });

  console.log(data);

  return <Container>{loading ? <Loader></Loader> : <p>korv</p>}</Container>;
}

const FETCH_MATCH_QUERY = gql`
  query($matchId: ID!) {
    getMatch(matchId: $matchId) {
      gameCode
      bingoId
      players {
        id
        nick
        finishedAt
        boxOrder {
          id
          placement
          checked
        }
      }
    }
  }
`;

export default HighscoreView;

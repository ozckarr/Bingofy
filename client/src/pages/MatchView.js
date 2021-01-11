import React, { useContext, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import { Card, Container, Loader } from "semantic-ui-react";

import { AuthContext } from "../context/auth";

import { Redirect } from "react-router-dom";

function MatchView(props) {
  const bingoId = props.match.params.bingoId;

  const { user } = useContext(AuthContext);

  const { loading, data } = useQuery(FETCH_BINGO_QUERY, {
    variables: {
      bingoId,
    },
  });

  let bingoMarkup;
  if (!user) {
    bingoMarkup = <Redirect to="/" />;
  } else {
    if (loading) {
      bingoMarkup = <Loader />;
    } else {
      const { title, bingoBoxes } = data.getBingo;
      bingoMarkup = (
        <Container>
          <Card fluid>
            <Card.Content>
              <Card.Header>
                <h3>{title}</h3>
              </Card.Header>
            </Card.Content>
            <div className="bingoContainer">
              {bingoBoxes.map((bingoBox) => (
                <div className="bingoBox" key={bingoBox.id}>
                  <div className="bingoBoxContent">{bingoBox.title}</div>
                </div>
              ))}
            </div>
          </Card>
        </Container>
      );
    }
  }

  return bingoMarkup;
}

const FETCH_BINGO_QUERY = gql`
  query($bingoId: ID!) {
    getBingo(bingoId: $bingoId) {
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

export default MatchView;

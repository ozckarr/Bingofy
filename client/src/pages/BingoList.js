import React, { useContext, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useHistory } from "react-router-dom";

import { Link } from "react-router-dom";
import {
  Grid,
  Loader,
  Button,
  Card,
  Transition,
  Confirm,
} from "semantic-ui-react";

import DeleteButton from "../components/DeleteButton";
import { AuthContext } from "../context/auth";
import { FETCH_BINGOS_QUERY } from "../util/graphql";

function BingoList() {
  const {
    user: { username },
  } = useContext(AuthContext);
  const [selectedMatch, setSelectedMatch] = useState({
    open: false,
    title: "",
    id: "",
  });
  let history = useHistory();

  const { loading, data: { getBingos: bingos } = {} } = useQuery(
    FETCH_BINGOS_QUERY
  );

  const checkValues = (bingo) => {
    // Doesn't render for non-owners i it isn't done
    if (username !== bingo.username && bingo.bingoBoxes.length <= 24) {
      return false;
    } else {
      return true;
    }
  };

  const handleClick = (bingo) => {
    setSelectedMatch({
      open: true,
      title: bingo.title,
      id: bingo.id,
    });
  };

  const [createMatch] = useMutation(CREATE_MATCH_MUTATION, {
    update(data) {
      console.log(data);
    },
    onCompleted({ createMatch: { gameCode } }) {
      console.log(createMatch);

      history.push({
        pathname: "/",
        state: { detail: gameCode },
      });
    },
    variables: {
      bingoName: selectedMatch.title,
      bingoId: selectedMatch.id,
    },
    onError(err) {
      console.log(err);
    },
  });

  return (
    <Transition.Group>
      {loading ? (
        <Loader />
      ) : (
        bingos &&
        bingos.map(
          (bingo) =>
            checkValues(bingo) && (
              <Grid.Column key={bingo.id} style={{ marginBottom: "1em" }}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>{bingo.title}</Card.Header>
                    {username === bingo.username && (
                      <>
                        <Button
                          circular
                          color="orange"
                          icon="edit"
                          as={Link}
                          to={`/bingos/${bingo.id}`}
                        />
                        <DeleteButton bingoId={bingo.id} />
                      </>
                    )}
                    {bingo.bingoBoxes.length <= 24 ? (
                      <p>Inte klar...</p>
                    ) : (
                      <>
                        <Button
                          circular
                          color="orange"
                          icon="play"
                          onClick={() => handleClick(bingo)}
                        />
                        <Confirm
                          open={selectedMatch.open}
                          content={`Vill ni spela ${selectedMatch.title}?`}
                          onCancel={() => setSelectedMatch({ open: false })}
                          onConfirm={createMatch}
                        />
                      </>
                    )}
                  </Card.Content>
                </Card>
              </Grid.Column>
            )
        )
      )}
    </Transition.Group>
  );
}

export default BingoList;

const CREATE_MATCH_MUTATION = gql`
  mutation createMatch($bingoId: String!, $bingoName: String!) {
    createMatch(bingoId: $bingoId, bingoName: $bingoName) {
      id
      gameCode
    }
  }
`;

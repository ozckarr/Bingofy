import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Loader,
  Button,
  Card,
  Transition,
} from "semantic-ui-react";

import DeleteButton from "../components/DeleteButton";
import JoinMatch from "../components/JoinMatch";
import { AuthContext } from "../context/auth";
import { FETCH_BINGOS_QUERY } from "../util/graphql";

function Home() {
  const { user } = useContext(AuthContext);

  const { loading, data: { getBingos: bingos } = {} } = useQuery(
    FETCH_BINGOS_QUERY
  );
  /*TODO Re-Fetch when returning*/

  return (
    <Container>
      <JoinMatch />
      {loading ? (
        <Loader />
      ) : user ? (
        <Transition.Group>
          {/*TODO nonloggedin welcome screen */}

          <Button circular color="orange" basic as={Link} to={`/highscore/`}>
            Highscore
          </Button>

          {bingos &&
            bingos.map((bingo) => (
              <Grid.Column key={bingo.id} style={{ marginBottom: "1em" }}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>{bingo.title}</Card.Header>
                    {user.username === bingo.username && (
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
                      <Button
                        circular
                        color="orange"
                        icon="play"
                        as={Link}
                        to={`/match/${bingo.id}`}
                      />
                    )}
                  </Card.Content>
                </Card>
              </Grid.Column>
            ))}
        </Transition.Group>
      ) : (
        <p>logga in...</p>
      )}
    </Container>
  );
}

export default Home;

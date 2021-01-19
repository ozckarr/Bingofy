import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Button, Card } from "semantic-ui-react";

import JoinMatch from "../components/JoinMatch";
import { AuthContext } from "../context/auth";

function Home(props) {
  const { user } = useContext(AuthContext);
  let gameCode;

  if (typeof props.location.state === "undefined") {
    gameCode = "";
  } else {
    gameCode = props.location.state.detail;
  }
  console.log();

  return (
    <Container>
      {gameCode !== "" ? (
        <Card fluid>
          <Card.Content>
            <Card.Meta>Dela och Spela</Card.Meta>
            <Card.Meta style={{ marginBottom: "1em" }}>BingoKod:</Card.Meta>
            <Card.Header>
              <h1>{gameCode}</h1>
            </Card.Header>
          </Card.Content>
        </Card>
      ) : (
        <h1>Anslut till spel</h1>
      )}
      <JoinMatch />
      <Button color="orange" basic as={Link} to={`/highscore/`}>
        Highscore
      </Button>
      {user && (
        <Button color="orange" basic as={Link} to={`/bingos`}>
          Bingos
        </Button>
      )}
    </Container>
  );
}

export default Home;

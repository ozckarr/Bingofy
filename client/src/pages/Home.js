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
    <div className="form-container">
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
        <hr />
        <Button
          style={{ marginBottom: "0.5em" }}
          color="orange"
          basic
          fluid
          as={Link}
          to={`/highscore/`}
        >
          <h4>Highscore</h4>
        </Button>
        {user && (
          <Button color="orange" basic fluid as={Link} to={`/bingos`}>
            <h4>Bingos</h4>
          </Button>
        )}
      </Container>
    </div>
  );
}

export default Home;

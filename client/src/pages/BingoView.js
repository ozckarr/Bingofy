import React, { useContext, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import { Button, Card, Form, Container, Loader } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
//import DeleteButton from "../components/DeleteButton";
import { Redirect } from "react-router-dom";

function SingleBingo(props) {
  const bingoId = props.match.params.bingoId;
  const [title, setTitle] = useState("");
  const [summery, setSummery] = useState("");

  const { user } = useContext(AuthContext);

  const { loading, data } = useQuery(FETCH_BINGO_QUERY, {
    variables: {
      bingoId,
    },
  });

  const [submitBox] = useMutation(SUBMIT_BINGOBOX_MUTATION, {
    update() {
      setTitle("");
      setSummery("");
      document.querySelector(".bingoBoxCreator").focus();
    },
    variables: {
      bingoId,
      title: title,
      summery: summery,
    },
    onError(err) {
      console.log(err);
    },
  });

  let bingoMarkup;
  if (!user) {
    bingoMarkup = <Redirect to="/" />;
  } else {
    if (loading) {
      bingoMarkup = <Loader />;
    } else {
      const { title, username, bingoBoxes } = data.getBingo;
      if (username === user.username) {
        bingoMarkup = (
          <Container>
            <Card fluid>
              <Card.Content>
                <Card.Header>
                  <h3>{title}</h3>
                </Card.Header>
                <Card.Meta>
                  <p>
                    Lägg till 25 brickor. Titeln är det som kommer att synas på
                    bingobrickan. Summeringen kan ge en länge beskrivning.
                  </p>
                </Card.Meta>
              </Card.Content>
              <Card fluid>
                <Card.Content>
                  <Form>
                    <Form.Input
                      type="text"
                      placeholder="Titel"
                      name={title}
                      value=""
                      onChange={(event) => setTitle(event.target.value)}
                    />
                    <Form.TextArea
                      type="text"
                      placeholder="Summering"
                      name={title}
                      value=""
                      onChange={(event) => setSummery(event.target.value)}
                    />
                    {/*TODO go back when 25> */}
                    <p>{25 - bingoBoxes.length} Boxar kvar</p>

                    <Button
                      type="submit"
                      icon="add"
                      color="orange"
                      disabled={title.trim() === ""}
                      onClick={submitBox}
                      circular
                    />
                  </Form>
                </Card.Content>
              </Card>
              {bingoBoxes.map((bingoBox) => (
                <Card.Content
                  key={bingoBox.id}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <div className="bingoBox">
                    <div className="bingoBoxContent">{bingoBox.title}</div>
                  </div>
                  <p style={{ marginLeft: "1em" }}>{bingoBox.summery}</p>
                </Card.Content>
              ))}
            </Card>
          </Container>
        );
      }
    }
  }

  return bingoMarkup;
}

const SUBMIT_BINGOBOX_MUTATION = gql`
  mutation($bingoId: String!, $title: String!, $summery: String) {
    createBingoBox(bingoId: $bingoId, title: $title, summery: $summery) {
      id
      bingoBoxes {
        id
        title
        summery
        checked
      }
    }
  }
`;

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

export default SingleBingo;

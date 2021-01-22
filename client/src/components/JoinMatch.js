import React, { useContext, useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useHistory } from "react-router-dom";

import { PlayerContext } from "../context/playerAuth";

function JoinMatch() {
  const context = useContext(PlayerContext);
  const [errors, setErrors] = useState({});
  let history = useHistory();

  const [values, setValues] = useState({
    gameCode: "",
    nick: "",
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [addPlayer, { loading }] = useMutation(ADD_PLAYER, {
    update(_, { data: { joinMatch: playerData } }) {
      context.join(playerData);
    },
    onCompleted({ joinMatch: { bingoId } }) {
      history.push(`/match/${bingoId}`);
    },
    onError(err) {
      setErrors(err);
    },
    variables: values,
  });

  const onSubmit = (event) => {
    event.preventDefault();
    addPlayer();
  };

  return (
    <div>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <Form.Input
          label="Bingokod"
          placeholder="Koden till bingot..."
          name="gameCode"
          type="text"
          value={values.gameCode}
          error={errors.gameCode ? true : false}
          onChange={onChange}
        ></Form.Input>
        <Form.Input
          label="Namn"
          placeholder="Namn i bingot"
          name="nick"
          type="text"
          value={values.nick}
          error={errors.nick ? true : false}
          onChange={onChange}
        ></Form.Input>
        <Button type="submit" color="orange" fluid>
          Spela
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const ADD_PLAYER = gql`
  mutation joinMatch($gameCode: String!, $nick: String!) {
    joinMatch(gameCode: $gameCode, nick: $nick) {
      token
      bingoId
      players {
        id
        nick
      }
    }
  }
`;

export default JoinMatch;

import React from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { useForm } from "../util/hooks";

function BingoCreator() {
  const { values, onChange, onSubmit } = useForm(createBingoCallback, {
    title: "",
    description: "",
  });

  const [createBingo, { error }] = useMutation(CREATE_BINGO_MUTATION, {
    variables: values,
    update(proxy, result) {
      values.title = "";
      values.description = "";
    },
    onError(err) {
      console.log(err);
    },
  });

  function createBingoCallback() {
    createBingo();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Nytt Bingo</h2>
        <Form.Field>
          <label>Bingo-titel</label>
          <Form.Input
            name="title"
            onChange={onChange}
            type="text"
            value={values.title}
            error={error ? true : false}
          />
          <label>Bingo beskrivning</label>
          <Form.Input
            name="description"
            onChange={onChange}
            type="textarea"
            value={values.description}
            error={error ? true : false}
          />
          <hr />
          <Button type="submit" color="orange">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_BINGO_MUTATION = gql`
  mutation createBingo($title: String!, $description: String) {
    createBingo(title: $title, description: $description) {
      id
      title
      description
      createdAt
      username
      bingoBrick {
        id
        placement
        title
        summery
        checked
      }
    }
  }
`;

export default BingoCreator;

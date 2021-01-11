import React from "react";
import { Button, Card } from "semantic-ui-react";

function BingoBoxContent({ props: { id, title, summery, checked }, checkBox }) {
  return (
    <Card.Content>
      {id === "" ? (
        <Card.Header>Klicka på en box för att komma igång.</Card.Header>
      ) : (
        <>
          <Card.Header>{title}</Card.Header>
          <Card.Description>{summery}</Card.Description>
          {checked ? (
            <Button
              circular
              color="orange"
              icon="window close outline"
              onClick={checkBox}
            />
          ) : (
            <Button circular color="red" icon="expand" onClick={checkBox} />
          )}
        </>
      )}
    </Card.Content>
  );
}

export default BingoBoxContent;

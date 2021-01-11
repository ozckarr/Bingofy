import React, { useContext, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import { Card, Container, Loader } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import rearrangeBingoBoxes from "../util/rearrangeBingoBoxes";

import { Redirect } from "react-router-dom";
import BingoBoxContent from "../components/BingoBoxContent";
import VictoryCheck from "../components/VictoryCheck";

function MatchView(props) {
  const bingoId = props.match.params.bingoId;
  const { user } = useContext(AuthContext);
  const [selectedBox, setSelectedBox] = useState({
    id: "",
    title: "",
    summery: "",
    checked: "",
  });

  const handleBoxClick = (bingoBox) => {
    setSelectedBox({
      id: bingoBox.id,
      title: bingoBox.title,
      summery: bingoBox.summery,
      checked: bingoBox.checked,
    });
  };

  const { loading, data } = useQuery(FETCH_BINGO_QUERY, {
    variables: {
      bingoId,
    },
  });

  const [checkBox] = useMutation(CHECK_BINGOBOX_MUTATION, {
    update() {
      setSelectedBox({ ...selectedBox, checked: !selectedBox.checked });
    },
    variables: {
      bingoId: bingoId,
      bingoBoxId: selectedBox.id,
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
      const { title, bingoBoxes } = data.getBingo;
      const reOrderedBingoBoxes = rearrangeBingoBoxes(bingoBoxes);
      bingoMarkup = (
        <Container>
          <Card fluid>
            <Card.Content>
              <VictoryCheck bingoBoxes={reOrderedBingoBoxes} />
              <Card.Header>
                <h3>{title}</h3>
              </Card.Header>
            </Card.Content>
            <div className="bingoContainer">
              {reOrderedBingoBoxes.map((bingoBox) => (
                <div
                  onClick={() => handleBoxClick(bingoBox)}
                  className={
                    selectedBox.id === bingoBox.id
                      ? "selected bingoBox"
                      : "bingoBox"
                  }
                  key={bingoBox.id}
                >
                  <div
                    className={
                      bingoBox.checked ? "bingoBoxChecked" : "bingoBoxUnChecked"
                    }
                  >
                    <div className="bingoBoxContent">{bingoBox.title}</div>
                  </div>
                </div>
              ))}
            </div>
            <Card fluid>
              <BingoBoxContent props={selectedBox} checkBox={checkBox} />
            </Card>
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

const CHECK_BINGOBOX_MUTATION = gql`
  mutation checkBingoBox($bingoId: String!, $bingoBoxId: String!) {
    checkBingoBox(bingoId: $bingoId, bingoBoxId: $bingoBoxId) {
      id
      bingoBoxes {
        id
        checked
      }
    }
  }
`;

export default MatchView;

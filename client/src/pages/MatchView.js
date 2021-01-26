import React, { useContext, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import { Card, Container, Loader } from "semantic-ui-react";

import { PlayerContext } from "../context/playerAuth";
import rearrangeBingoBoxes from "../util/rearrangeBingoBoxes";

import { Redirect } from "react-router-dom";
import BingoBoxContent from "../components/BingoBoxContent";
import VictoryCheck from "../components/VictoryCheck";

function MatchView(props) {
  const bingoId = props.match.params.bingoId;

  const {
    player,
    player: { matchId },
  } = useContext(PlayerContext);

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

  // Need to deconstruct this way, otherwise will match and bingo cancel out let data
  let bingo = useQuery(FETCH_BINGO_QUERY, {
    variables: {
      bingoId,
    },
    onError(err) {
      console.log(err);
    },
  });
  let loading = bingo.loading;

  let match = useQuery(FETCH_MATCH_QUERY, {
    variables: {
      matchId,
    },
    onError(err) {
      console.log(err);
    },
  });
  let matchLoading = match.loading;

  const [checkBox] = useMutation(CHECK_BINGOBOX_MUTATION, {
    update() {
      setSelectedBox({ ...selectedBox, checked: !selectedBox.checked });
    },
    variables: {
      matchId,
      playerId: player.playerId,
      bingoBoxId: selectedBox.id,
    },
    onError(err) {
      console.log(err);
    },
  });

  let bingoMarkup;
  if (!player) {
    bingoMarkup = <Redirect to="/" />;
  } else {
    if (loading || matchLoading) {
      bingoMarkup = <Loader />;
    } else {
      const { title, bingoBoxes } = bingo.data.getBingo;
      const playerInfo = match.data.getMatch.players.find(
        (x) => x.id === player.playerId
      );
      const reOrderedBingoBoxes = rearrangeBingoBoxes(bingoBoxes, playerInfo);
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
        cloudinaryId
      }
    }
  }
`;

const FETCH_MATCH_QUERY = gql`
  query($matchId: ID!) {
    getMatch(matchId: $matchId) {
      gameCode
      bingoId
      bingoName
      players {
        id
        nick
        finishedAt
        boxOrder {
          id
          placement
          checked
        }
      }
    }
  }
`;

const CHECK_BINGOBOX_MUTATION = gql`
  mutation checkBingoBox(
    $matchId: String!
    $playerId: String!
    $bingoBoxId: String!
  ) {
    checkBingoBox(
      matchId: $matchId
      playerId: $playerId
      bingoBoxId: $bingoBoxId
    ) {
      gameCode
      bingoId
      players {
        id
        nick
        finishedAt
        boxOrder {
          placement
          checked
        }
      }
    }
  }
`;

export default MatchView;

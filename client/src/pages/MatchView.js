import React, { useContext, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import { Card, Loader } from "semantic-ui-react";

import { PlayerContext } from "../context/playerAuth";
import rearrangeBingoBoxes from "../util/rearrangeBingoBoxes";

import { Redirect } from "react-router-dom";
import BingoBoxContent from "../components/BingoBoxContent";
import VictoryCheck from "../components/VictoryCheck";

import { Image } from "cloudinary-react";

const { NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME } = require("../util/config");

function MatchView() {
  const {
    player,
    player: { matchId },
  } = useContext(PlayerContext);

  const { data: match, loading: loadingMatch } = useQuery(FETCH_MATCH_QUERY, {
    variables: {
      matchId,
    },
    onError(err) {
      console.log(err);
    },
  });

  const { data: bingo, loading: loadingBingo } = useQuery(
    FETCH_BINGO_WITH_GAMECODE_QUERY,
    {
      variables: {
        matchId,
      },
      onError(err) {
        console.log(err);
      },
    }
  );

  const [selectedBox, setSelectedBox] = useState({
    id: "",
    title: "",
    summery: "",
    checked: "",
    cloudinaryId: "",
  });
  const handleBoxClick = (bingoBox) => {
    setSelectedBox({
      id: bingoBox.id,
      title: bingoBox.title,
      summery: bingoBox.summery,
      checked: bingoBox.checked,
      cloudinaryId: bingoBox.cloudinaryId,
    });
  };

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
  } else if (loadingMatch || loadingBingo) {
    bingoMarkup = <Loader />;
  } else if (typeof bingo.getBingoWithGameCode == "u") {
    bingoMarkup = <Loader />;
  } else {
    const { title, bingoBoxes } = bingo.getBingoWithGameCode;

    const playerInfo = match.getMatch.players.find(
      (x) => x.id === player.playerId
    );
    let boxOrder = "";
    boxOrder = rearrangeBingoBoxes(bingoBoxes, playerInfo);
    if (boxOrder === "") {
      bingoMarkup = <Loader />;
    } else {
      bingoMarkup = (
        <div style={{ maxWidth: "600px", margin: "auto" }}>
          <Card.Content>
            <VictoryCheck bingoBoxes={boxOrder} />
            <Card.Header>
              <h3>{title}</h3>
            </Card.Header>
          </Card.Content>
          <div style={{ paddingBottom: "100%" }}>
            <Card className="highscoreBingo" fluid>
              <div className="highscoreBingoOverlay">
                {boxOrder.map((bingoBox) => (
                  <React.Fragment key={bingoBox.id}>
                    {bingoBox.checked ? (
                      <div
                        className="highscoreBingoBoxOverlay checked"
                        onClick={() => handleBoxClick(bingoBox)}
                      ></div>
                    ) : (
                      <>
                        <div
                          className="highscoreBingoBoxOverlay"
                          onClick={() => handleBoxClick(bingoBox)}
                        ></div>
                      </>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="highscoreBingoContainer">
                {boxOrder.map((bingoBox) => (
                  <React.Fragment key={bingoBox.id}>
                    {bingoBox.cloudinaryId === "" ? (
                      <div className="highscoreBingoBox">
                        <p>{bingoBox.title}</p>
                      </div>
                    ) : (
                      <>
                        <Image
                          cloudName={`${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`}
                          publicId={bingoBox.cloudinaryId}
                          responsive
                          width="auto"
                          crop="scale"
                          className="highscoreBingoBox"
                        />
                      </>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </Card>
          </div>
          <Card fluid>
            <BingoBoxContent props={selectedBox} checkBox={checkBox} />
          </Card>
        </div>
      );
    }
  }

  return bingoMarkup;
}

const FETCH_BINGO_WITH_GAMECODE_QUERY = gql`
  query($matchId: String!) {
    getBingoWithGameCode(matchId: $matchId) {
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

import React, { useCallback, useContext, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import { useDropzone } from "react-dropzone";
import { Button, Card, Form, Container, Loader } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Image } from "cloudinary-react";

import { AuthContext } from "../context/auth";
import { Redirect } from "react-router-dom";
const {
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
} = require("../util/config");

function BingoView(props) {
  const bingoId = props.match.params.bingoId;
  const [title, setTitle] = useState("");
  const [summery, setSummery] = useState("");
  const [cloudinaryId, setCloudinaryId] = useState("");
  const [errors, setErrors] = useState({});

  const { user } = useContext(AuthContext);

  const onDrop = useCallback((acceptedFiles) => {
    //https://www.youtube.com/watch?v=V8w7K1HdrFo&ab_channel=LeighHalliday fix env
    const url = `https://api.cloudinary.com/v1_1/${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    acceptedFiles.forEach(async (acceptedFile) => {
      const formData = new FormData();
      formData.append("file", acceptedFile);
      formData.append("upload_preset", NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      const response = await fetch(url, {
        method: "post",
        body: formData,
      });
      const { public_id } = await response.json();
      setCloudinaryId(public_id);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accepts: "images/*",
    multiple: false,
  });

  const { loading, data } = useQuery(FETCH_BINGO_QUERY, {
    variables: {
      bingoId,
    },
  });

  //TODO: useForm / reset when submit {value={summery?}}
  const [submitBox] = useMutation(SUBMIT_BINGOBOX_MUTATION, {
    update() {
      setTitle("");
      setSummery("");
      setCloudinaryId("");
    },
    variables: {
      bingoId,
      title,
      summery,
      cloudinaryId,
    },
    onCompleted() {
      setTitle("");
      setSummery("");
      setCloudinaryId("");
    },
    onError(err) {
      console.log(err);

      setErrors(err.graphQLErrors[0].extensions.exception.errors);
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
                    {/*TODO reset when new> */}
                    <Form.Input
                      type="text"
                      placeholder="Titel"
                      name={title}
                      error={errors.title ? true : false}
                      onChange={(event) => setTitle(event.target.value)}
                    />
                    <Form.TextArea
                      type="text"
                      placeholder="Summering"
                      name="summery"
                      onChange={(event) => setSummery(event.target.value)}
                    />

                    {cloudinaryId === "" ? (
                      <div
                        {...getRootProps()}
                        className={`dropzone ${
                          isDragActive && "dropzoneActive"
                        }`}
                      >
                        <input {...getInputProps()} />
                        Bild här (Valfritt)
                      </div>
                    ) : (
                      <Image
                        cloudName={`${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`}
                        publicId={cloudinaryId}
                        heighth="300"
                        width="300"
                        crop="scale"
                      />
                    )}

                    {!(bingoBoxes.length > 24) ? (
                      <>
                        <p>{25 - bingoBoxes.length} Boxar kvar</p>

                        <Button
                          type="submit"
                          icon="add"
                          color="orange"
                          disabled={title.trim() === ""}
                          onClick={submitBox}
                          circular
                        />
                      </>
                    ) : (
                      <Button color="orange" fluid as={Link} to={`/bingos/`}>
                        Klar
                      </Button>
                    )}
                  </Form>
                </Card.Content>
              </Card>
              {bingoBoxes.map((bingoBox) => (
                <Card.Content
                  key={bingoBox.id}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  {!(bingoBox.cloudinaryId === "") && (
                    <Image
                      cloudName={`${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`}
                      publicId={bingoBox.cloudinaryId}
                      heighth="300"
                      width="300"
                      crop="scale"
                    />
                  )}
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
  mutation createBingoBox(
    $bingoId: String!
    $title: String!
    $summery: String
    $cloudinaryId: String
  ) {
    createBingoBox(
      bingoId: $bingoId
      title: $title
      summery: $summery
      cloudinaryId: $cloudinaryId
    ) {
      id
      bingoBoxes {
        id
        title
        summery
        cloudinaryId
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
        cloudinaryId
      }
    }
  }
`;

export default BingoView;

import React, { useContext } from "react";
import Layout from "../../components/Layout";
import { Alert, ButtonGroup, Col, Row } from "react-bootstrap";
import Computers from "../../components/Computers";
import { Button } from "react-bootstrap";
import { postRequestHandler } from "../../lib/submit";
import { Link } from "react-router-dom";
import GameContext from "../../contexts/game.context";

export default function Connections() {
  const game = useContext(GameContext);
  return (
    <Layout>
      <Row>
        <Col>
          <p className="display-4 border-bottom pb-3 border-success">
            ~/<Link to="/computers/">computers</Link>/slaves.json
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Alert variant="info" className="bg-transparent border border-danger">
            {game.connections.length} connected computers
          </Alert>
        </Col>
      </Row>
      <Row lg={3} sm={1} className="gy-4">
        <Computers
          thumbnail
          onlyConnected={true}
          render={(game, _session, computer, connections) => {
            const connected =
              connections &&
              connections?.filter((that) => computer.id === that.id).length !==
                0;
            return (
              <Row>
                <Col>
                  <div className="d-grid mt-2 gap-2">
                    <ButtonGroup>
                      <Button
                        variant="secondary"
                        href={"#navigate:/computers/files/" + computer.id + "/"}
                      >
                        📁
                      </Button>
                      <Button
                        variant="secondary"
                        href={"#navigate:/computers/processes/" + computer.id}
                      >
                        ⚙️
                      </Button>
                      <Button
                        variant="secondary"
                        href={"#navigate:/computers/hardware/" + computer.id}
                      >
                        🛠️
                      </Button>
                    </ButtonGroup>
                    {connected ? (
                      <Button
                        variant="danger"
                        onClick={async () => {
                          await postRequestHandler(
                            "/computers/disconnect",
                            {
                              computerId: computer.id,
                            },
                            () => {
                              game.load();
                            }
                          );
                        }}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={async () => {
                          await postRequestHandler(
                            "/computers/connect",
                            {
                              computerId: computer.id,
                            },
                            () => {
                              game.load();
                            }
                          );
                        }}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            );
          }}
        />
      </Row>
      <Row className="mt-3">
        <Col>
          <Alert
            variant="info"
            className={"bg-transparent border border-success"}
          >
            {game.computers.length - game.connections.length} disconnected
            computers
          </Alert>
        </Col>
      </Row>
      <Row lg={3} sm={1} className="gy-3">
        <Computers
          thumbnail
          onlyDisconnected={true}
          render={(game, _session, computer, connections) => {
            const connected =
              connections &&
              connections?.filter((that) => computer.id === that.id).length !==
                0;
            return (
              <Row>
                <Col>
                  <div className="d-grid mt-2">
                    {connected ? (
                      <Button
                        variant="danger"
                        onClick={async () => {
                          await postRequestHandler(
                            "/computers/disconnect",
                            {
                              computerId: computer.id,
                            },
                            () => {
                              game.load();
                            }
                          );
                        }}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={async () => {
                          await postRequestHandler(
                            "/computers/connect",
                            {
                              computerId: computer.id,
                            },
                            () => {
                              game.load();
                            }
                          );
                        }}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            );
          }}
        />
      </Row>
    </Layout>
  );
}

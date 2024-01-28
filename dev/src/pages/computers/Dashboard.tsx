import React, { useContext } from "react";
import Layout from "../../components/Layout";
import { Col, Row, Card, Button, Table } from "react-bootstrap";
import GameContext from "../../contexts/game.context";
import { useNavigate } from "react-router-dom";
import { postRequestHandler } from "../../lib/submit";

export default function Dashboard() {
  const game = useContext(GameContext);
  const navigate = useNavigate();
  return (
    <Layout>
      <Row>
        <Col>
          <p className="display-4 border-bottom pb-3 border-success">
            ~/computers/
          </p>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col lg={4}>
          <Row lg={1} className="gy-4">
            <Col>
              <Card body className="bg-transparent border-success">
                <p className="text-center text-white">
                  You can <u>obtain a new computer</u> by purchasing one from a
                  manufacturer.
                </p>
                <hr />
                <div className="d-grid">
                  <Button
                    variant="success"
                    onClick={async () => {
                      await postRequestHandler(
                        "/computers/create",
                        {},
                        async () => {
                          navigate(0);
                        },
                        (error) => {
                          console.log(error);
                        }
                      );
                    }}
                  >
                    Purchase A Computer
                  </Button>
                </div>
              </Card>
            </Col>
            <Col>
              <Card body className="bg-transparent border border-primary">
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigate("/computers/connections");
                    }}
                  >
                    Slaves
                    <br />
                    <span className="badge bg-danger">
                      {game?.connections?.length || 0} CONNECTIONS
                    </span>
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigate("/computers/processes");
                    }}
                  >
                    Processes <br />
                    <span className="badge bg-danger">
                      {(() => {
                        let count = 0;
                        game.computers.forEach(
                          (val) => (count = count + val.process.length)
                        );
                        return count;
                      })()}{" "}
                      GLOBALLY
                    </span>
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col>
          {game.computers.length !== 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>type</th>
                  <th>ip</th>
                  <th>name</th>
                  <th>hardware rating</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {game.computers
                  .sort((a, b) => a.ip.charCodeAt(0) - b.ip.charCodeAt(0))
                  .map((computer) => {
                    const connected =
                      game.connections &&
                      game.connections.filter((that) => that.id === computer.id)
                        .length !== 0;
                    return (
                      <tr>
                        <td>{computer.type}</td>
                        <td>{computer.ip}</td>
                        <td>{computer.data.title}</td>
                        <td>
                          {Math.floor(
                            computer.hardware.reduce((prev, cur) => {
                              return {
                                ...prev,
                                strength: Math.round(
                                  cur.strength + prev.strength
                                ),
                              };
                            }).strength /
                              computer.hardware.length /
                              24
                          )}
                        </td>
                        <td>
                          {!connected ? (
                            <Button
                              variant="success"
                              size="sm"
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
                          ) : (
                            <Button
                              variant="danger"
                              size="sm"
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
                          )}
                          <Button
                            variant="secondary"
                            className="ms-2"
                            disabled={!connected}
                            onClick={() => {
                              navigate("/computers/files/" + computer.id);
                            }}
                            size="sm"
                          >
                            Files
                          </Button>
                          <Button
                            variant="secondary"
                            className="ms-2"
                            onClick={() => {
                              navigate("/computers/logs/" + computer.id);
                            }}
                            disabled={!connected}
                            size="sm"
                          >
                            Logs
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          ) : (
            <Card body className="bg-transparent border border-danger">
              You don't have any computers!
            </Card>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

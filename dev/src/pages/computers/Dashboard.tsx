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
    <Layout fluid>
      <Row>
        <Col>
          <p className="display-4 border-bottom pb-3 border-success">
            ~/computers/
          </p>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col lg={3}>
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
              <Card body className="bg-transparent border border-secondary">
                <div className="d-grid gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      navigate("/computers/connections");
                    }}
                  >
                    Connections
                    <br />
                    <span
                      className={
                        "badge " +
                        (game?.connections?.length !== 0
                          ? "bg-success"
                          : "bg-secondary")
                      }
                    >
                      {game?.connections?.length || 0} ACTIVE CONNECTIONS
                    </span>
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      navigate("/computers/processes");
                    }}
                  >
                    Processes <br />
                    <span className="badge bg-black">
                      {(() => {
                        let count = 0;
                        game.computers.forEach(
                          (val) => (count = count + val.process.length)
                        );
                        return count;
                      })()}{" "}
                      ACTIVE GLOBALLY
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
                  .map((computer, index) => {
                    const connected =
                      game.connections &&
                      game.connections.filter((that) => that.id === computer.id)
                        .length !== 0;
                    return (
                      <tr key={index}>
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
                        <td className="d-grid gap-2">
                          {!connected ? (
                            <Button
                              variant="success"
                              size="sm"
                              className="bg-transparent border border-success"
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
                              className="bg-transparent border border-danger"
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

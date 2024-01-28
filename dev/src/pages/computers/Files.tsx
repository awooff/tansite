import React, { useContext } from "react";
import Layout from "../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import GameContext from "../../contexts/game.context";
import { Card, Col, Row, Table, Button, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createProcess } from "../../lib/process";

export default function Files() {
  const game = useContext(GameContext);
  const { computerId } = useParams();
  const computer = game.computers.find((val) => val.id === computerId);
  const navigate = useNavigate();

  //if no computer or not connected
  if (!computer || !game.connections?.find((val) => val.id === computer?.id))
    return (
      <Layout>
        <Row>
          <Col>
            <Card
              body
              className="bg-transparent border border-danger text-center text-white"
            >
              This computer is invalid. Have you tried connecting to it?
            </Card>
          </Col>
        </Row>
      </Layout>
    );

  const hddSpace = computer.hardware
    .filter((val) => val.type === "HDD")
    .reduce((prev, cur) => {
      return {
        ...prev,
        strength: prev.strength + cur.strength,
      };
    }).strength;

  const ramSpace = computer.hardware
    .filter((val) => val.type === "RAM")
    .reduce((prev, cur) => {
      return {
        ...prev,
        strength: prev.strength + cur.strength,
      };
    }).strength;

  const hddUsage =
    computer.software.length === 0
      ? 0
      : computer.software.reduce((prev, cur) => {
          return {
            ...prev,
            size: cur.size + prev.size,
          };
        }).size;

  const installed = computer.software.filter((software) => software.installed);
  let ramUsage = 0;
  if (installed.length !== 0)
    ramUsage = installed.reduce((prev, cur) => {
      return {
        ...prev,
        size: cur.size + prev.size,
      };
    }).size;

  return (
    <Layout>
      <Row>
        <Col>
          <p className="display-4 border-bottom pb-3 border-success">
            ~/<Link to="/computers/">computers</Link>/files/
            {computer.ip.replace(/\./g, "_")}/
          </p>
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          <Card body className="bg-transparent border border-success">
            <p className="text-center">
              <span className="text-white">HDD Usage</span>
              <br />
              <span
                style={{
                  fontSize: 12,
                }}
              >
                {(hddUsage / 1024).toFixed(3)}GB /{" "}
                {(hddSpace / 1024).toFixed(3)} GB
              </span>
            </p>
            <ProgressBar
              now={100 * (hddUsage / hddSpace)}
              variant={100 * (hddUsage / hddSpace) > 90 ? "danger" : "success"}
            ></ProgressBar>
          </Card>
          <Card body className="bg-transparent border border-success mt-4">
            <p className="text-center">
              <span className="text-white">RAM Usage</span>
              <br />
              <span
                style={{
                  fontSize: 12,
                }}
              >
                {(ramUsage / 1024).toFixed(3)}GB /{" "}
                {(ramSpace / 1024).toFixed(3)} GB
              </span>
            </p>
            <ProgressBar
              now={100 * (ramUsage / ramSpace)}
              variant={100 * (ramUsage / ramSpace) > 90 ? "danger" : "success"}
            ></ProgressBar>
          </Card>
          <Card body className="bg-transparent border border-primary mt-4">
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/computers/logs/" + computer.id);
                }}
              >
                Logs
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/computers/logs/" + computer.id);
                }}
              >
                Processes{" "}
                <span className="badge bg-danger">
                  {computer.process.length}
                </span>
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/computers/logs/" + computer.id);
                }}
              >
                Hardware{" "}
                <span className="badge bg-secondary">
                  🛠️{" "}
                  {Math.floor(
                    computer.hardware.reduce((prev, cur) => {
                      return {
                        ...prev,
                        strength: Math.round(cur.strength + prev.strength),
                      };
                    }).strength /
                      computer.hardware.length /
                      24
                  )}
                </span>
              </Button>
            </div>
          </Card>
        </Col>
        <Col lg>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>type</th>
                <th>name</th>
                <th>level</th>
                <th>size</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {computer.software
                .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0))
                .map((software) => {
                  return (
                    <tr>
                      <td>{software.type}</td>
                      <td
                        className={
                          software.userId === game.user.id ? "bg-secondary" : ""
                        }
                      >
                        {software.installed ? (
                          <span
                            style={{
                              borderBottom: "2px dashed gray",
                            }}
                          >
                            {software.name || "Unknown " + software.type}
                          </span>
                        ) : (
                          <>{software.name || "Unknown " + software.type}</>
                        )}
                      </td>
                      <td>{software.level}</td>
                      <td>{software.size}</td>
                      <td>
                        {software.installed ? (
                          <Button
                            variant="secondary"
                            className="ms-2"
                            size="sm"
                            onClick={async (e) => {
                              const target = e.currentTarget;
                              target.setAttribute("disabled", "true");
                              await createProcess(
                                "action",
                                {
                                  action: "uninstall",
                                  ip: computer.ip,
                                  softwareId: software.id,
                                  connectionId: computer.id,
                                },
                                true
                              ).finally(() => {
                                target.setAttribute("disabled", "false");
                              });

                              game.load();
                            }}
                          >
                            Uninstall
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="secondary"
                              className="ms-2"
                              size="sm"
                              onClick={async (e) => {
                                const target = e.currentTarget;
                                target.setAttribute("disabled", "true");
                                await createProcess(
                                  "action",
                                  {
                                    action: "install",
                                    ip: computer.ip,
                                    softwareId: software.id,
                                    connectionId: computer.id,
                                  },
                                  true
                                ).finally(() => {
                                  target.setAttribute("disabled", "false");
                                });
                                game.load();
                              }}
                            >
                              Install
                            </Button>
                            <Button
                              variant="secondary"
                              className="ms-2"
                              size="sm"
                              onClick={async (e) => {
                                const target = e.currentTarget;
                                target.setAttribute("disabled", "true");
                                await createProcess(
                                  "action",
                                  {
                                    action: "delete",
                                    ip: computer.ip,
                                    softwareId: software.id,
                                    connectionId: computer.id,
                                  },
                                  true
                                ).finally(() => {
                                  target.setAttribute("disabled", "false");
                                });
                                game.load();
                              }}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                        <Button
                          variant="secondary"
                          className="ms-2"
                          size="sm"
                          onClick={async (e) => {
                            const target = e.currentTarget;
                            target.setAttribute("disabled", "true");
                            await createProcess(
                              "action",
                              {
                                action: "inspect",
                                ip: computer.ip,
                                softwareId: software.id,
                                connectionId: computer.id,
                              },
                              true
                            ).finally(() => {
                              target.setAttribute("disabled", "false");
                            });
                            game.load();
                          }}
                        >
                          Inspect
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Layout>
  );
}

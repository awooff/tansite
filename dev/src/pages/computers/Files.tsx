import React, { useContext } from "react";
import Layout from "../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import GameContext from "../../contexts/game.context";
import { Card, Col, Row, Table, Button, ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { postRequestHandler } from "../../lib/submit";

export default function Files() {
  const game = useContext(GameContext);
  const { computerId } = useParams();
  const computer = game.connections.find((val) => val.id === computerId);
  const navigate = useNavigate();
  if (!computer)
    return (
      <Layout>
        <Row>
          <Col>
            <Card
              body
              className="bg-transparent border border-danger text-center text-white"
            >
              Invalid Computer
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

  const hddUsage = computer.software.reduce((prev, cur) => {
    return {
      ...prev,
      size: cur.size + prev.size,
    };
  }).size;

  const ramUsage = computer.software
    .filter((software) => software.installed)
    .reduce((prev, cur) => {
      return {
        ...prev,
        size: cur.size + prev.size,
      };
    }).size;

  return (
    <Layout>
      <Row>
        <Col>
          <p className="display-4">
            ~/<Link to="/computers/">computers</Link>/files/{computer.ip}
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
            <div className="d-grid gap-4">
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/computers/log/" + computer.id);
                }}
              >
                View Logs
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/computers/log/" + computer.id);
                }}
              >
                View Processes
              </Button>
            </div>
          </Card>
        </Col>
        <Col lg>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th></th>
                <th>type</th>
                <th>name</th>
                <th>level</th>
                <th>size</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {computer.software.map((software) => {
                return (
                  <tr>
                    <td>{software.installed ? "✅" : ""}</td>
                    <td>{software.type}</td>
                    <td
                      className={
                        software.userId === game.user.id ? "bg-success" : ""
                      }
                    >
                      {software.installed ? (
                        <u>{software.name || "Unknown " + software.type}</u>
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
                          onClick={async () => {
                            await postRequestHandler("/processes/create", {
                              type: "action",
                              action: "uninstall",
                              ip: computer.ip,
                              softwareId: software.id,
                              connectionId: computer.id,
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
                            onClick={async () => {
                              await postRequestHandler("/processes/create", {
                                type: "action",
                                action: "install",
                                ip: computer.ip,
                                softwareId: software.id,
                                connectionId: computer.id,
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
                            onClick={async () => {
                              await postRequestHandler("/processes/create", {
                                type: "action",
                                action: "delete",
                                ip: computer.ip,
                                softwareId: software.id,
                                connectionId: computer.id,
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
                        onClick={async () => {
                          await postRequestHandler("/processes/create", {
                            type: "action",
                            action: "inspect",
                            ip: computer.ip,
                            softwareId: software.id,
                            connectionId: computer.id,
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

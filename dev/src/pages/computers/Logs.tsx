import React, { useCallback, useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GameContext from "../../contexts/game.context";
import { Card, Col, Row, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import LogComponent from "../../components/LogComponent";
import { useProcessStore } from "../../lib/stores/process.store";

export default function Logs() {
  const game = useContext(GameContext);
  const { computerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const processStore = useProcessStore();

  const computer = game.computers.find((val) => val.id === computerId);
  const connected =
    game.connections.find((val) => val.id === computerId) !== undefined;

  //if no computer or not connected
  if (!computer)
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

  //if no computer or not connected
  if (!connected)
    return (
      <Layout>
        <Row>
          <Col>
            <Card
              body
              className="bg-transparent border border-danger text-center text-white"
            >
              You are not connected to this computer!
            </Card>
          </Col>
        </Row>
      </Layout>
    );

  return (
    <Layout fluid>
      <Row>
        <Col>
          <p className="display-4 border-bottom pb-3 border-success">
            ~/<Link to="/computers/">computers</Link>/logs/
            {computer.ip.replace(/\./g, "_")}.log
          </p>
        </Col>
      </Row>
      {location?.state?.return ? (
        <Row>
          <Col>
            <Alert
              variant="primary"
              className="bg-transparent border border-primary"
            >
              <p>Would you like to return to the previous page?</p>
              <Button
                variant="primary"
                onClick={() => {
                  navigate(location.state.return, {
                    state: {
                      connectionId: computer.id,
                    },
                  });
                }}
              >
                Return
              </Button>
            </Alert>
          </Col>
        </Row>
      ) : (
        <></>
      )}
      <Row>
        <Col lg={3}>
          <Card body className="bg-transparent border border-info">
            <div className="d-grid gap-2">
              <Button
                variant="info"
                onClick={() => {
                  navigate("/computers/");
                }}
              >
                View Computers
              </Button>
              <Button
                variant="info"
                onClick={() => {
                  navigate("/computers/connections");
                }}
              >
                View Connections
              </Button>
            </div>
          </Card>
          <Card body className="bg-transparent border border-secondary mt-3">
            <div className="d-grid gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  navigate("/computers/files/" + computer.id);
                }}
              >
                Files
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  navigate("/computers/logs/" + computer.id);
                }}
              >
                Logs
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  navigate("/computers/processes/" + computer.id);
                }}
              >
                Processes{" "}
                <span className="badge bg-danger">
                  {
                    processStore.processes.filter(
                      (that) => that.computerId === computer.id
                    ).length
                  }
                </span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  navigate("/computers/logs/" + computer.id);
                }}
              >
                Hardware{" "}
                <span className="badge bg-black">
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
        <Col>
          <div className="d-grid border border-info p-4">
            {computerId ? (
              <LogComponent
                computerId={computerId}
                ip={computer.ip}
                local={true}
              />
            ) : (
              <Alert variant="danger">Invalid computer</Alert>
            )}
          </div>
        </Col>
      </Row>
    </Layout>
  );
}

import React, { useCallback, useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GameContext from "../../contexts/game.context";
import { Card, Col, Row, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createProcess } from "../../lib/process";
import LogComponent from "../../components/LogComponent";

export default function Logs() {
  const game = useContext(GameContext);
  const { computerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const computer = game.computers.find((val) => val.id === computerId);

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

  return (
    <Layout>
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
                  navigate(location.state.return);
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
        <Col lg={4}>
          <Row>
            <Col>
              <Card body className="bg-transparent border border-danger">
                <div className="d-grid">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={async (e) => {
                      e.currentTarget.setAttribute("disabled", "true");
                      await createProcess(
                        "wipe",
                        {
                          ip: computer.ip,
                          connectionId: computer.id,
                        },
                        true
                      );
                      game.load();
                    }}
                  >
                    Wipe Log
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
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
                Processes{" "}
                <span className="badge bg-danger">
                  {computer.process.length}
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
          {computerId ? (
            <LogComponent computerId={computerId} local={true} />
          ) : (
            <Alert variant="danger">Invalid computer</Alert>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

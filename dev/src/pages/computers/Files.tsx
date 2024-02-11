import React, { useContext } from "react";
import Layout from "../../components/Layout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GameContext from "../../contexts/game.context";
import { Card, Col, Row, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import FileComponent from "../../components/FileComponent";

export default function Files() {
  const game = useContext(GameContext);
  const { computerId } = useParams();
  const computer = game.computers.find((val) => val.id === computerId);
  const navigate = useNavigate();
  const location = useLocation();

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
    <Layout fluid>
      <Row>
        <Col>
          <p className="display-4 border-bottom pb-3 border-success">
            ~/<Link to="/computers/">computers</Link>/files/
            {computer.ip.replace(/\./g, "_")}/
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
          <Card body className="bg-transparent border border-secondary">
            <div className="d-grid gap-2">
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
          <Card body className="bg-transparent border border-warning mt-3">
            <div className="d-grid gap-2">
              <Button
                variant="warning"
                onClick={() => {
                  navigate("/computers/");
                }}
              >
                View Your Computers
              </Button>
              <Button
                variant="warning"
                onClick={() => {
                  navigate("/computers/connections");
                }}
              >
                View Your Connections
              </Button>
            </div>
          </Card>
        </Col>
        <Col>
          <div className="d-grid border border-warning p-4">
            <FileComponent
              computer={computer}
              uploadTargetIp={location?.state?.uploadTargetIp}
              onCompletion={(process) => {
                game.load();
              }}
            ></FileComponent>
          </div>
        </Col>
      </Row>
    </Layout>
  );
}

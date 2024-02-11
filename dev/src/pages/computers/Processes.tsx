import React, { useCallback, useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GameContext from "../../contexts/game.context";
import { Card, Col, Row, Button, Alert, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import LogComponent from "../../components/LogComponent";
import { postRequestHandler } from "../../lib/submit";
import { Process } from "../../lib/types/process.type";

export default function Processes() {
  const game = useContext(GameContext);
  const { computerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState(0);

  const computer = game.computers.find((val) => val.id === computerId);
  const connected =
    game.connections.find((val) => val.id === computerId) !== undefined;

  const fetchProcesses = useCallback(async () => {
    if (!computerId) return;
    let result = await postRequestHandler<{
      processes: Process[];
      count: number;
      pages: number;
    }>("/computers/processes", {
      computerId: computerId,
      page: page,
    });

    return result.data;
  }, [computerId]);

  useEffect(() => {
    if (
      !game.loaded ||
      !computerId ||
      !game.computers.find((val) => val.id === computerId)
    )
      return;

    fetchProcesses().then((result) => {
      setProcesses(result?.processes || []);
      setCount(result?.processes.length || 0);
      setPages(result?.pages || 0);
    });
  }, [computerId, game]);

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
            ~/<Link to="/computers/">computers</Link>/processes/
            {computer.ip.replace(/\./g, "_")}.csv
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
          <Card body className="bg-transparent border border-primary mt-3">
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/computers/");
                }}
              >
                View Computers
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/computers/connections");
                }}
              >
                View Connections
              </Button>
            </div>
          </Card>
        </Col>
        <Col>
          <div className="d-grid border border-primary p-4">
            {processes.length !== 0 ? (
              <Stack gap={2}>
                {processes.map((process) => {
                  return (
                    <Row>
                      <Col>
                        <Card body>{process.type}</Card>
                      </Col>
                    </Row>
                  );
                })}
              </Stack>
            ) : (
              <Alert variant="danger">No Processes Available</Alert>
            )}
          </div>
        </Col>
      </Row>
    </Layout>
  );
}

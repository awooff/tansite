import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Layout from "../../components/Layout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GameContext from "../../contexts/game.context";
import {
  Card,
  Col,
  Row,
  Button,
  Alert,
  Stack,
  ListGroup,
  ProgressBar,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import LogComponent from "../../components/LogComponent";
import { postRequestHandler } from "../../lib/submit";
import { Process } from "../../lib/types/process.type";
import { useProcessStore } from "../../lib/stores/process.store";

export default function Processes() {
  const game = useContext(GameContext);
  const { computerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [time, setTime] = useState(Date.now());
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const interval = useRef<number>();
  const processStore = useProcessStore();

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
    interval.current = setInterval(() => {
      setTime(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  useEffect(() => {
    if (
      !game.loaded ||
      !computerId ||
      !game.computers.find((val) => val.id === computerId)
    )
      return;

    setLoading(true);
    fetchProcesses().then((result) => {
      processStore.setProcesses(result?.processes || processStore.processes);
      setCount(result?.processes.length || 0);
      setPages(result?.pages || 0);
      setLoading(false);
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
          <Card body className="bg-transparent border border-primary">
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
          <div className="d-grid border border-primary p-4">
            {loading && processStore.processes.length === 0 ? (
              <Alert
                variant="danger"
                className="text-center bg-transparent border-secondary border mt-0 mb-0 rounded-0"
              >
                <Row className="justify-content-center mb-4">
                  <Col lg={3}>
                    <img src="/icons/info.png" className="mx-auto img-fluid" />
                  </Col>
                </Row>
                <p className="display-2">LOADING</p>
                <p>Please wait for your proceses to be loaded...</p>
              </Alert>
            ) : (
              <>
                {processStore.processes.length !== 0 ? (
                  <Stack gap={4}>
                    {processStore.processes.map((process) => {
                      return (
                        <Row>
                          <Col>
                            <Card
                              body
                              className="bg-transparent border border-secondary"
                            >
                              <Row>
                                <Col lg={2}>
                                  {(() => {
                                    switch (process.type) {
                                      case "hack":
                                        return (
                                          <img
                                            src="/icons/hack.png"
                                            className="img-fluid mx-auto"
                                          ></img>
                                        );
                                      default:
                                        return (
                                          <img
                                            src="/icons/message.png"
                                            className="img-fluid mx-auto"
                                          ></img>
                                        );
                                    }
                                  })()}
                                </Col>
                                <Col>
                                  <div className="d-grid">
                                    <h5 className="pb-2 border-bottom border-secondary">
                                      {process.type}@{process.ip}
                                    </h5>
                                  </div>
                                  <Row className="mt-5">
                                    <Col>
                                      <div className="d-grid">
                                        <Button
                                          variant="danger"
                                          className="bg-transparent border-danger"
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </Col>
                                    <Col>
                                      <div className="d-grid">
                                        <Button
                                          variant="success"
                                          disabled={
                                            time <
                                            new Date(
                                              process.completion
                                            ).getTime()
                                          }
                                          className="bg-transparent border-success"
                                        >
                                          Complete
                                        </Button>
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row className="mt-4">
                                    <Col>
                                      <ProgressBar
                                        now={Math.floor(
                                          ((time -
                                            new Date(
                                              process.started
                                            ).getTime()) /
                                            (new Date(
                                              process.completion
                                            ).getTime() -
                                              new Date(
                                                process.started
                                              ).getTime())) *
                                            100
                                        )}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Card>
                          </Col>
                        </Row>
                      );
                    })}
                  </Stack>
                ) : (
                  <Alert
                    variant="danger"
                    className="text-center bg-transparent border border-danger mb-0"
                  >
                    <img src="/icons/hack.png"></img>
                    <p>No Processes Available</p>
                  </Alert>
                )}
              </>
            )}
          </div>
        </Col>
      </Row>
    </Layout>
  );
}

import React, { useCallback, useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import GameContext from "../../contexts/game.context";
import { Card, Col, Row, Table, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { postRequestHandler } from "../../lib/submit";
import { Log } from "../../lib/types/log.type";
import { Computer } from "../../lib/types/computer.type";
import { createProcess } from "../../lib/process";

export default function Logs() {
  const game = useContext(GameContext);
  const { computerId } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<Log[]>([]);
  const [valid, setValid] = useState(false);
  const [page, setPage] = useState(0);
  const [pageMax, setPages] = useState(0);
  const [count, setCount] = useState(0);
  const [computer, setComputer] = useState<Computer | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!computerId) return;

    const result = await postRequestHandler<{
      logs: Log[];
      pages: number;
      count: number;
    }>("/computers/log", {
      computerId: computerId,
      page: page,
    });

    return result.data;
  }, [computerId, page]);

  useEffect(() => {
    if (!game.loaded) return;
    if (!fetchLogs) return;

    const computer =
      game.computers.find((val) => val.id === computerId) || null;
    setComputer(computer);

    if (!computer || !game.connections?.find((val) => val.id === computer?.id))
      setValid(false);

    fetchLogs().then((data) => {
      if (!data) setValid(false);
      else {
        setPages(data.pages);
        setCount(data.count);
        setLogs(data.logs || []);
        setValid(true);
      }
    });
  }, [game, computerId, fetchLogs]);

  //if no computer or not connected
  if (!valid || !computer)
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
      <Row>
        <Col lg={4}>
          <Row>
            <Col>
              <Card body className="bg-transparent border border-danger">
                <div className="d-grid">
                  <Button
                    variant="danger"
                    disabled={logs.length === 0}
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
          <Card body className="bg-transparent border border-primary mt-3">
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  navigate("/computers/files/" + computer.id);
                }}
              >
                Files
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
        <Col>
          <Card body>
            <Alert className="bg-transparent border border-danger">
              {count} total logs{" "}
              <span
                style={{
                  float: "right",
                }}
                className="badge bg-danger"
              >
                page {page + 1}/{pageMax}
              </span>
            </Alert>
            <Row>
              <Col>
                <Table
                  striped
                  bordered
                  hover
                  style={{
                    fontSize: "12px",
                  }}
                >
                  <thead>
                    <tr>
                      <th>message</th>
                      <th>from</th>
                      <th>time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs
                      .sort((a, b) => b.id - a.id)
                      .map((log) => {
                        return (
                          <tr>
                            <td>{log.message}</td>
                            <td>{log.computer.ip}</td>
                            <td>{new Date(log.created).toString()}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}

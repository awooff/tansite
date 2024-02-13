import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GameContext from "../contexts/game.context";
import {
  Card,
  Col,
  Row,
  Table,
  Button,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import { createProcess } from "../lib/process";
import { Computer } from "../lib/types/computer.type";
import { Process } from "../lib/types/process.type";
import { postRequestHandler } from "../lib/submit";

function FileTreeComponent({
  children,
  connectionId,
  ip,
  computerId,
  onCreation,
  onError,
  onCompletion,
  local,
  uploadTargetIp,
}: {
  children?: any;
  ip?: string;
  computerId?: string;
  connectionId: string;
  local?: boolean;
  onCreation?: (process: Process) => void;
  onError?: (error: Error) => void;
  onCompletion?: (process: Process) => void;
  uploadTargetIp?: string;
}) {
  const game = useContext(GameContext);
  const [computer, setComputer] = useState<Computer>();
  const [loading, setLoading] = useState<boolean>();

  const fetchFiles = useCallback(
    async (connectionId: string, ip?: string, computerId?: string) => {
      let result = await postRequestHandler<{
        computer: Computer;
      }>(local ? "/computers/view" : "/internet/fetch", {
        ip,
        connectionId,
        computerId,
      });
      return result.data.computer;
    },
    [local]
  );

  const hddSpace = computer
    ? computer.hardware
        .filter((val) => val.type === "HDD")
        .reduce((prev, cur) => {
          return {
            ...prev,
            strength: prev.strength + cur.strength,
          };
        }).strength
    : 0;

  const ramSpace = computer
    ? computer.hardware
        .filter((val) => val.type === "RAM")
        .reduce((prev, cur) => {
          return {
            ...prev,
            strength: prev.strength + cur.strength,
          };
        }).strength
    : 0;

  const hddUsage = computer
    ? computer.software.length === 0
      ? 0
      : computer.software.reduce((prev, cur) => {
          return {
            ...prev,
            size: cur.size + prev.size,
          };
        }).size
    : 0;

  const installed = computer
    ? computer.software.filter((software) => software.installed)
    : [];

  let ramUsage = 0;
  if (installed.length !== 0)
    ramUsage = installed.reduce((prev, cur) => {
      return {
        ...prev,
        size: cur.size + prev.size,
      };
    }).size;

  useEffect(() => {
    if ((!ip && !computerId) || !connectionId) return;

    setLoading(true);
    fetchFiles(connectionId, ip, computerId)
      .then((computer) => setComputer(computer))
      .finally(() => {
        setLoading(false);
      });
  }, [ip, connectionId, computerId]);

  if (loading)
    return (
      <Alert
        variant="danger"
        className="text-center bg-transparent border-secondary border mt-0 mb-0 rounded-0"
      >
        <Row className="justify-content-center mb-4">
          <Col lg={3}>
            <img src="/icons/query.png" className="mx-auto img-fluid" />
          </Col>
        </Row>
        <p className="display-2">LOADING</p>
        <p>Please wait for the file tree to be downloaded...</p>
      </Alert>
    );

  if (!computer)
    return (
      <>
        <Alert
          variant="danger"
          className="text-center bg-transparent border border-danger mb-0"
        >
          <img src="/icons/hack.png"></img>
          <p>No Files Available</p>
        </Alert>
      </>
    );

  return (
    <>
      <Row>
        <Col lg={3}>
          <img className="img-fluid" src="/icons/query.png"></img>
          <Card
            body
            className="bg-transparent border border-success"
            style={{
              fontSize: "12px",
            }}
          >
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
          <Card
            body
            className="bg-transparent border border-success mt-4"
            style={{
              fontSize: "12px",
            }}
          >
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
          {children}
        </Col>
        <Col lg>
          <Table
            striped
            bordered
            hover
            style={{
              fontSize: "14px",
            }}
          >
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
                .map((software, index) => {
                  return (
                    <tr key={index}>
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
                      <td className="d-grid gap-2">
                        {software.installed ? (
                          <Button
                            variant="info"
                            className="ms-2 border border-info bg-transparent"
                            size="sm"
                            onClick={async (e) => {
                              const target = e.currentTarget;
                              target.setAttribute("disabled", "true");
                              let result = await createProcess<{
                                process: Process;
                              }>(
                                "action",
                                {
                                  action: "uninstall",
                                  ip: computer.ip,
                                  softwareId: software.id,
                                  connectionId: connectionId || computer.id,
                                },
                                true,
                                onCreation,
                                onError
                              ).finally(() => {
                                target.setAttribute("disabled", "false");
                              });
                              if (onCompletion)
                                onCompletion(result.data.process);
                              setLoading(true);
                              fetchFiles(connectionId, ip, computerId)
                                .then((computer) => setComputer(computer))
                                .finally(() => {
                                  setLoading(false);
                                });
                            }}
                          >
                            Uninstall
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="info"
                              className="ms-2 border border-info bg-transparent"
                              size="sm"
                              onClick={async (e) => {
                                const target = e.currentTarget;
                                target.setAttribute("disabled", "true");
                                let result = await createProcess<{
                                  process: Process;
                                }>(
                                  "action",
                                  {
                                    action: "install",
                                    ip: computer.ip,
                                    softwareId: software.id,
                                    connectionId: connectionId || computer.id,
                                  },
                                  true,
                                  onCreation,
                                  onError
                                ).finally(() => {
                                  target.setAttribute("disabled", "false");
                                });
                                if (onCompletion)
                                  onCompletion(result.data.process);
                                setLoading(true);
                                fetchFiles(connectionId, ip, computerId)
                                  .then((computer) => setComputer(computer))
                                  .finally(() => {
                                    setLoading(false);
                                  });
                              }}
                            >
                              Install
                            </Button>
                          </>
                        )}
                        <Button
                          variant="danger"
                          className="ms-2 border border-danger bg-transparent"
                          size="sm"
                          onClick={async (e) => {
                            const target = e.currentTarget;
                            target.setAttribute("disabled", "true");
                            let result = await createProcess<{
                              process: Process;
                            }>(
                              "action",
                              {
                                action: "delete",
                                ip: computer.ip,
                                softwareId: software.id,
                                connectionId: connectionId || computer.id,
                              },
                              true,
                              onCreation,
                              onError
                            ).finally(() => {
                              target.setAttribute("disabled", "false");
                            });
                            if (onCompletion) onCompletion(result.data.process);
                            setLoading(true);
                            fetchFiles(connectionId, ip, computerId)
                              .then((computer) => setComputer(computer))
                              .finally(() => {
                                setLoading(false);
                              });
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="success"
                          className="ms-2 border border-success bg-transparent"
                          size="sm"
                          hidden={!connectionId}
                          onClick={async (e) => {
                            const target = e.currentTarget;
                            target.setAttribute("disabled", "true");
                            let result = await createProcess<{
                              process: Process;
                            }>(
                              "action",
                              {
                                action: "download",
                                ip: computer.ip,
                                softwareId: software.id,
                                connectionId: connectionId || computer.id,
                              },
                              true,
                              onCreation,
                              onError
                            ).finally(() => {
                              target.setAttribute("disabled", "false");
                            });
                            if (onCompletion) onCompletion(result.data.process);
                            setLoading(true);
                            fetchFiles(connectionId, ip, computerId)
                              .then((computer) => setComputer(computer))
                              .finally(() => {
                                setLoading(false);
                              });
                          }}
                        >
                          Download
                        </Button>
                        <Button
                          variant="primary"
                          className="ms-2 border border-primary bg-transparent"
                          hidden={!uploadTargetIp}
                          size="sm"
                          onClick={async (e) => {
                            const target = e.currentTarget;
                            target.setAttribute("disabled", "true");
                            let result = await createProcess<{
                              process: Process;
                            }>(
                              "action",
                              {
                                action: "upload",
                                ip: uploadTargetIp,
                                softwareId: software.id,
                                connectionId: connectionId || computer.id,
                              },
                              true,
                              onCreation,
                              onError
                            ).finally(() => {
                              target.setAttribute("disabled", "false");
                            });
                            if (onCompletion) onCompletion(result.data.process);
                            setLoading(true);
                            fetchFiles(connectionId, ip, computerId)
                              .then((computer) => setComputer(computer))
                              .finally(() => {
                                setLoading(false);
                              });
                          }}
                        >
                          Upload to {uploadTargetIp}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
}

export default FileTreeComponent;

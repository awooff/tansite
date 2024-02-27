import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
  Stack,
} from "react-bootstrap";
import { createProcess } from "../lib/process";
import { Computer } from "../lib/types/computer.type";
import { Process } from "../lib/types/process.type";
import { postRequestHandler } from "../lib/submit";
import WebEvents from "../lib/events";

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
  const eventRef = useRef(() => {});

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
    if (eventRef.current) WebEvents.off("processCompleted", eventRef.current);

    eventRef.current = () => {
      setLoading(true);
      fetchFiles(connectionId, ip, computerId)
        .then((computer) => setComputer(computer))
        .finally(() => {
          setLoading(false);
        });
    };
    WebEvents.on("processCompleted", eventRef.current);
    eventRef.current();

    return () => {
      if (eventRef.current) WebEvents.off("processCompleted", eventRef.current);
    };
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
            className="bg-transparent border border-success mt-3"
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
          <Row className="row-cols-6">
            {computer.software
              .sort((a, b) => a.type.charCodeAt(0) - b.type.charCodeAt(0))
              .map((software, index) => {
                return (
                  <Col>
                    <div
                      className="d-grid file-button p-2"
                      style={{
                        position: "absolute",
                        zIndex: "2",
                      }}
                    >
                      <Card body className="bg-black border border-success">
                        <Stack gap={2}>
                          {software.installed ? (
                            <Button
                              variant="info"
                              className="border border-info bg-transparent"
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
                              }}
                            >
                              Uninstall
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="info"
                                className="border border-info bg-transparent"
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
                                }}
                              >
                                Install
                              </Button>
                            </>
                          )}
                          <Button
                            variant="danger"
                            className="border border-danger bg-transparent"
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
                              if (onCompletion)
                                onCompletion(result.data.process);
                            }}
                          >
                            Delete
                          </Button>
                          <Button
                            variant="success"
                            className="border border-success bg-transparent"
                            size="sm"
                            hidden={computer.id === connectionId}
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
                              if (onCompletion)
                                onCompletion(result.data.process);
                            }}
                          >
                            Download
                          </Button>
                          <Button
                            variant="primary"
                            className="border border-primary bg-transparent"
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
                              if (onCompletion)
                                onCompletion(result.data.process);
                            }}
                          >
                            Upload to {uploadTargetIp}
                          </Button>
                        </Stack>
                      </Card>
                    </div>
                    <Card
                      body
                      className={
                        "bg-transparent " +
                        (software.installed
                          ? "border border-secondary p-2"
                          : "")
                      }
                    >
                      <p>
                        <span
                          className={
                            "badge " +
                            (software.level >= 50
                              ? "bg-success"
                              : software.level >= 25
                                ? "bg-warning"
                                : software.level >= 10
                                  ? "bg-primary"
                                  : "bg-secondary")
                          }
                        >
                          ⭐{software.level}
                        </span>
                        <span className="badge bg-transparent">
                          {software.size}mb
                        </span>
                      </p>

                      <img
                        src="/icons/query.png"
                        className="img-fluid mx-auto p-4"
                        style={{
                          background: 'url("/icons/icon.png")',
                          backgroundSize: "contain",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          filter:
                            software.level >= 50
                              ? "hue-rotate(270deg)"
                              : software.level >= 25
                                ? "hue-rotate(180deg)"
                                : software.level >= 10
                                  ? "hue-rotate(90deg)"
                                  : "grayscale(100%)",
                        }}
                      />
                      <p className="text-center mt-4">
                        {software.name || software.type}
                      </p>
                    </Card>
                  </Col>
                );
              })}
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default FileTreeComponent;

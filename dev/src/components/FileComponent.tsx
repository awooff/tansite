import React, { useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import GameContext from "../contexts/game.context";
import { Card, Col, Row, Table, Button, ProgressBar } from "react-bootstrap";
import { createProcess } from "../lib/process";
import { Computer } from "../lib/types/computer.type";
import { Process } from "../lib/types/process.type";

function FileComponent({
  children,
  computer,
  onCreation,
  onError,
  onCompletion,
  connectionId,
  uploadTargetIp,
}: {
  children?: any;
  computer: Computer;
  connectionId?: string;
  onCreation?: (process: Process) => void;
  onError?: (error: Error) => void;
  onCompletion?: (process: Process) => void;
  uploadTargetIp?: string;
}) {
  const game = useContext(GameContext);
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
                            game.load(); //reload for downloads
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
                            game.load(); //reload for uploads
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

export default FileComponent;

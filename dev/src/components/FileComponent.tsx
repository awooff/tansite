import React, { useContext } from "react";
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

function FileComponent({
  children,
  computer,
  onCreation,
  onError,
}: {
  children?: any;
  computer: Computer;
  onCreation?: (process: Process) => void;
  onError?: (error: Error) => void;
}) {
  const game = useContext(GameContext);
  const navigate = useNavigate();
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
          {children}
        </Col>
        <Col lg>
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
                      <td>
                        {software.installed ? (
                          <Button
                            variant="secondary"
                            className="ms-2"
                            size="sm"
                            onClick={async (e) => {
                              const target = e.currentTarget;
                              target.setAttribute("disabled", "true");
                              await createProcess(
                                "action",
                                {
                                  action: "uninstall",
                                  ip: computer.ip,
                                  softwareId: software.id,
                                  connectionId: computer.id,
                                },
                                true,
                                onCreation,
                                onError
                              ).finally(() => {
                                target.setAttribute("disabled", "false");
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
                              onClick={async (e) => {
                                const target = e.currentTarget;
                                target.setAttribute("disabled", "true");
                                await createProcess(
                                  "action",
                                  {
                                    action: "install",
                                    ip: computer.ip,
                                    softwareId: software.id,
                                    connectionId: computer.id,
                                  },
                                  true,
                                  onCreation,
                                  onError
                                ).finally(() => {
                                  target.setAttribute("disabled", "false");
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
                              onClick={async (e) => {
                                const target = e.currentTarget;
                                target.setAttribute("disabled", "true");
                                await createProcess(
                                  "action",
                                  {
                                    action: "delete",
                                    ip: computer.ip,
                                    softwareId: software.id,
                                    connectionId: computer.id,
                                  },
                                  true,
                                  onCreation,
                                  onError
                                ).finally(() => {
                                  target.setAttribute("disabled", "false");
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
                          onClick={async (e) => {
                            const target = e.currentTarget;
                            target.setAttribute("disabled", "true");
                            await createProcess(
                              "action",
                              {
                                action: "inspect",
                                ip: computer.ip,
                                softwareId: software.id,
                                connectionId: computer.id,
                              },
                              true,
                              onCreation,
                              onError
                            ).finally(() => {
                              target.setAttribute("disabled", "false");
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
    </>
  );
}

export default FileComponent;

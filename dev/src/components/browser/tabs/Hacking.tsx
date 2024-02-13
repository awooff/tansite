import { useContext, useEffect, useState } from "react";
import GameContext from "../../../contexts/game.context";
import { Computer } from "../../../lib/types/computer.type";
import { Alert, Button, Card, ListGroup, Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Process } from "../../../lib/types/process.type";
import { createProcess } from "../../../lib/process";
import { HomepageRequest } from "../../../pages/internet/Browser";
import SessionContext from "../../../contexts/session.context";
import { useProcessStore } from "../../../lib/stores/process.store";
import BrowserLayout from "../BrowserLayout";

function Hacking({
  connectionId,
  ip,
  computer,
  markdown,
  valid,
  access,
  setTab,
  fetchHomepage,
}: {
  connectionId: string;
  ip: string;
  computer: Computer;
  markdown: string;
  valid: boolean;
  access: object | null;
  setTab: (tab: string) => void;
  fetchHomepage: (ip: string, connectionId: string) => Promise<HomepageRequest>;
}) {
  const game = useContext(GameContext);
  const session = useContext(SessionContext);
  const processStore = useProcessStore();
  const [process, setProcess] = useState<Process | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!computer || ip || connectionId || !session.loaded) return;
    if (
      session.data.logins[connectionId]?.find(
        (that) => that.ip === ip || that.id === computer.id
      ) ||
      access
    )
      setTab("logs");
  }, [session, connectionId, ip, computer]);

  const executor = game.computers.find(
    (computer) => computer.id === connectionId
  );

  const installedCracker = executor?.software.find(
    (software) => software.installed && software.type === "cracker"
  );

  const installedExploiter = executor?.software.find(
    (software) => software.installed && software.type === "ftpr"
  );

  if (!valid)
    return (
      <>
        <Alert
          variant="danger"
          className="text-center bg-transparent border-danger border mt-0 mb-0 rounded-0"
          style={{ fontFamily: "initial" }}
        >
          <p className="display-2">404</p>
          <p>This website does not exist</p>
        </Alert>
      </>
    );

  return (
    <BrowserLayout
      setTab={setTab}
      computer={computer}
      connectionId={connectionId}
      error={error}
      process={process}
    >
      <Alert
        variant="danger"
        className="bg-transparent border-success border rounded-0 text-center"
      >
        <p className="display-4 mt-2 mb-5">
          {computer.data.title}
          <br />
          <b
            style={{
              fontSize: "50%",
            }}
          >
            {computer.ip}
          </b>
        </p>
        <span className="badge bg-success mb-3">AVAILABLE TO HACK</span>
      </Alert>
      <Row>
        <Col>
          <Card
            body
            className={
              "bg-transparent rounded-0 " +
              (installedCracker ? "border-primary" : "border-secondary")
            }
            style={{
              height: "100%",
            }}
          >
            <p
              className={
                "display-5 mt-4 mb-4 text-center " +
                (installedCracker ? "text-white" : "")
              }
            >
              Exploit Shell
            </p>
            <div className="d-grid gap-2">
              <Card
                body
                className="mb-3 bg-transparent border-secondary rounded-0 text-white text-center"
              >
                {!installedCracker ? (
                  <>You need to install a cracker</>
                ) : (
                  <ListGroup className="rounded-0">
                    <ListGroup.Item variant="light">
                      Your cracker level is <u>{installedCracker.level}</u>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Your CPU level is{" "}
                      <u>
                        {
                          executor?.hardware?.reduce((prev, cur) => {
                            if (cur.type !== "CPU")
                              return {
                                ...prev,
                              };

                            return {
                              ...prev,
                              strength: cur.strength + prev.strength,
                            };
                          }).strength
                        }
                      </u>
                    </ListGroup.Item>
                  </ListGroup>
                )}
              </Card>
              <Button
                disabled={
                  !installedCracker ||
                  (process !== null && process.type === "hack")
                }
                onClick={async () => {
                  setError(null);
                  try {
                    let result = await createProcess<{
                      process: Process;
                    }>(
                      "hack",
                      {
                        ip: computer.ip,
                        connectionId: connectionId,
                      },
                      true,
                      (process) => {
                        processStore.addProcess(process);
                        setProcess(process);
                      }
                    ).finally(() => {
                      setProcess(null);
                    });
                    processStore.removeProcess(result.data.process);
                    fetchHomepage(ip, connectionId).then(() => {
                      setTab("connection");
                    });
                  } catch (err: any) {
                    setError(new Error(err));
                    setTimeout(() => {
                      setError(null);
                    }, 3000);
                  }
                }}
                variant={!installedCracker ? "secondary" : "primary"}
              >
                Hack
              </Button>
            </div>
          </Card>
        </Col>
        <Col>
          <Card
            body
            className={
              "bg-transparent rounded-0 " +
              (installedExploiter ? "border-primary" : "border-secondary")
            }
            style={{
              height: "100%",
            }}
          >
            <p
              className={
                "display-5 text-center mt-4 mb-4 " +
                (installedExploiter ? "text-white" : "")
              }
            >
              Exploit FTP
            </p>
            <div className="d-grid gap-2">
              <Card
                body
                className="mb-3 bg-transparent border-secondary rounded-0 text-white text-center"
              >
                {!installedExploiter ? (
                  <span>You need to install an exploiter</span>
                ) : (
                  <ListGroup className="rounded-0">
                    <ListGroup.Item variant="light">
                      Your exploiter level is <u>{installedExploiter.level}</u>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Your CPU level is{" "}
                      <u>
                        {
                          executor?.hardware?.reduce((prev, cur) => {
                            if (cur.type !== "CPU")
                              return {
                                ...prev,
                              };

                            return {
                              ...prev,
                              strength: cur.strength + prev.strength,
                            };
                          }).strength
                        }
                      </u>
                    </ListGroup.Item>
                  </ListGroup>
                )}
              </Card>
              <Button
                variant={!installedExploiter ? "secondary" : "primary"}
                onClick={async () => {
                  setError(null);
                  try {
                    let result = await createProcess<{
                      process: Process;
                    }>(
                      "exploit",
                      {
                        ip: computer.ip,
                        connectionId: connectionId,
                      },
                      true,
                      (process) => {
                        processStore.addProcess(process);
                        setProcess(process);
                      }
                    ).finally(() => {
                      setProcess(null);
                    });
                    processStore.removeProcess(result.data.process);
                    fetchHomepage(ip, connectionId).then(() => {
                      setTab("connection");
                    });
                  } catch (err: any) {
                    setError(new Error(err));
                    setTimeout(() => {
                      setError(null);
                    }, 3000);
                  }
                }}
                disabled={
                  !installedExploiter ||
                  (process !== null && process.type === "exploit")
                }
              >
                Exploit
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </BrowserLayout>
  );
}

export default Hacking;

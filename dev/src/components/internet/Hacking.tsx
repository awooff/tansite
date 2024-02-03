import { useContext, useState } from "react";
import GameContext from "../../contexts/game.context";
import { Computer } from "../../lib/types/computer.type";
import { Alert, Button, Card, ListGroup, Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Process } from "../../lib/types/process.type";
import { createProcess } from "../../lib/process";

function Hacking({
  connectionId,
  ip,
  computer,
  markdown,
  valid,
  access,
  setTab,
}: {
  connectionId: string;
  ip: string;
  computer: Computer | null;
  markdown: string;
  valid: boolean;
  access: object | null;
  setTab: (tab: string) => void;
}) {
  const game = useContext(GameContext);
  const [process, setProcess] = useState<Process | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const connectedComputer = game.computers.find(
    (computer) => computer.id === connectionId
  );

  const installedCracker = connectedComputer?.software.find(
    (software) => software.installed && software.type === "cracker"
  );

  const installedExploiter = connectedComputer?.software.find(
    (software) => software.installed && software.type === "ftpr"
  );

  return (
    <>
      {!valid || !computer ? (
        <Alert
          variant="danger"
          className="text-center bg-transparent border-danger border mt-0 mb-0 rounded-0"
          style={{ fontFamily: "initial" }}
        >
          <p className="display-2">404</p>
          <p>This website does not exist</p>
        </Alert>
      ) : (
        <>
          {error ? (
            <Alert variant="danger">{error.message || error.toString()}</Alert>
          ) : (
            <></>
          )}
          {computer.type === "search_engine" ? (
            <Button
              className="rounded-0"
              variant="success"
              size="sm"
              onClick={() => {
                setTab("homepage");
              }}
            >
              Search
            </Button>
          ) : (
            <Button
              className="rounded-0"
              variant="success"
              size="sm"
              onClick={() => {
                setTab("homepage");
              }}
            >
              Homepage
            </Button>
          )}
          <Button className="rounded-0" variant="danger" size="sm">
            Hack
          </Button>
          <div className="d-grid bg-black border border-danger p-3">
            <Alert
              variant="danger"
              className="bg-transparent border-secondary border rounded-0 text-center"
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
                            Your cracker level is{" "}
                            <u>{installedCracker.level}</u>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Your CPU level is{" "}
                            <u>
                              {
                                connectedComputer?.hardware?.reduce(
                                  (prev, cur) => {
                                    if (cur.type !== "CPU")
                                      return {
                                        ...prev,
                                      };

                                    return {
                                      ...prev,
                                      strength: cur.strength + prev.strength,
                                    };
                                  }
                                ).strength
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
                        await createProcess(
                          "hack",
                          {
                            ip: computer.ip,
                            connectionId: connectionId,
                          },
                          true,
                          (process) => {
                            setProcess(process);
                          }
                        ).catch((err) => {
                          setError(new Error(err));
                          setProcess(null);

                          setTimeout(() => {
                            setError(null);
                          }, 3000);
                        });
                        await game.load();
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
                            Your exploiter level is{" "}
                            <u>{installedExploiter.level}</u>
                          </ListGroup.Item>
                          <ListGroup.Item>
                            Your CPU level is{" "}
                            <u>
                              {
                                connectedComputer?.hardware?.reduce(
                                  (prev, cur) => {
                                    if (cur.type !== "CPU")
                                      return {
                                        ...prev,
                                      };

                                    return {
                                      ...prev,
                                      strength: cur.strength + prev.strength,
                                    };
                                  }
                                ).strength
                              }
                            </u>
                          </ListGroup.Item>
                        </ListGroup>
                      )}
                    </Card>
                    <Button
                      variant={!installedExploiter ? "secondary" : "primary"}
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
          </div>
        </>
      )}
    </>
  );
}

export default Hacking;

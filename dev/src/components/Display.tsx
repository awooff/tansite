import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Button,
  ButtonToolbar,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  ListGroup,
  Nav,
  NavDropdown,
  Navbar,
  Row,
} from "react-bootstrap";
import { Computer } from "../lib/types/computer.type";
import GameContext from "../contexts/game.context";

function Display({
  connectionId,
  history,
  ip,
  computer,
  markdown,
  onVisit,
  onConnectionSwitch,
  valid,
  access,
}: {
  connectionId: string;
  history: Record<string, string>;
  ip: string;
  computer: Computer | null;
  markdown: string;
  onVisit: (currentAddress: string) => void;
  onConnectionSwitch: (connection: Computer) => void;
  valid: boolean;
  access: object | null;
}) {
  const [currentAddress, setCurrentAddress] = useState(ip);
  const game = useContext(GameContext);
  const [isHacking, setIsHacking] = useState(true);

  useEffect(() => {
    setCurrentAddress(ip);
    setIsHacking(false);
  }, [ip]);

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
      <Navbar bg="dark" data-bs-theme="dark">
        <Container fluid>
          <NavDropdown
            title={
              <span className="badge bg-success m-2 rounded-0">
                👤{" "}
                {connectionId ? (
                  <>
                    {
                      game.connections.find((that) => that.id === connectionId)
                        ?.ip
                    }{" "}
                    <span className="badge bg-black rounded-0">
                      {game.connections.find((that) => that.id === connectionId)
                        ?.data?.title || "Unknown Computer"}
                    </span>
                  </>
                ) : (
                  "NO CONNECTIONS"
                )}
              </span>
            }
          >
            {game.connections.map((connection, index) => (
              <div className="d-grid">
                <NavDropdown.Item
                  style={{
                    fontSize: 12,
                  }}
                  onClick={() => onConnectionSwitch(connection)}
                  className={connectionId === connection.id ? "bg-success" : ""}
                >
                  <span className={"me-2 badge rounded-0 bg-transparent"}>
                    #{index}
                  </span>
                  <span className={"me-2 badge rounded-0 bg-black"}>
                    {connection.data?.title}
                  </span>
                  <b className="border-bottom border-white">{connection.ip} </b>{" "}
                  {history[connection.id] ? (
                    <>
                      <br />
                      <span
                        className={
                          "mt-2 badge rounded-0 " +
                          (connectionId === connection.id
                            ? "bg-transparent"
                            : "bg-transparent")
                        }
                      >
                        📄 Viewing {history[connection.id]}
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                </NavDropdown.Item>
              </div>
            ))}
          </NavDropdown>
          <Nav className="me-auto mx-auto">
            <ButtonToolbar aria-label="Toolbar with Button groups">
              <InputGroup
                style={{
                  width: "72vw",
                }}
              >
                <InputGroup.Text id="btnGroupAddon" className="rounded-0">
                  🌎
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  className="rounded-0"
                  placeholder={computer?.ip || ""}
                  value={currentAddress}
                  name="addressbar"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") onVisit(currentAddress);
                  }}
                  onChange={(e) => {
                    setCurrentAddress(e.target.value);
                  }}
                  aria-label="Input group example"
                  aria-describedby="btnGroupAddon"
                />
                <InputGroup.Text id="btnGroupAddon" className="rounded-0">
                  <Button
                    onClick={() => onVisit(currentAddress)}
                    size="sm"
                    className="rounded-0 bg-transparent border-0"
                  >
                    Visit
                  </Button>
                </InputGroup.Text>
              </InputGroup>
            </ButtonToolbar>
          </Nav>
        </Container>
      </Navbar>
      {isHacking ? (
        <>
          <Card body className="rounded-0 bg-transparent border-secondary p-1">
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
                <Button
                  className="bg-success rounded-0"
                  size="sm"
                  onClick={() => {
                    setIsHacking(false);
                  }}
                >
                  Homepage
                </Button>
                <div
                  className="d-grid bg-black border border-success p-3"
                  style={{
                    minHeight: "70vh",
                    height: "100%",
                  }}
                >
                  <Alert
                    variant="danger"
                    className="bg-transparent border-danger border rounded-0 text-center"
                  >
                    <p className="display-1 mt-4">
                      Hack <u>{computer.ip}</u>
                    </p>
                    Hacking this computer will allow you to add it to your
                    network
                  </Alert>
                  <Row>
                    <Col>
                      <Card
                        body
                        className="bg-transparent border-primary rounded-0"
                        style={{
                          height: "100%",
                        }}
                      >
                        <p
                          className={
                            "display-5 text-center " +
                            (installedCracker ? "text-white" : "")
                          }
                        >
                          Exploit Shell
                        </p>
                        <div className="d-grid">
                          <Card
                            body
                            className="mb-3 bg-transparent border-primary text-white text-center"
                          >
                            {!installedCracker ? (
                              <>You need to install a cracker</>
                            ) : (
                              <ListGroup>
                                <ListGroup.Item>
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
                                            strength:
                                              cur.strength + prev.strength,
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
                            disabled={!installedCracker}
                            variant={
                              !installedCracker ? "secondary" : "primary"
                            }
                          >
                            Hack
                          </Button>
                        </div>
                      </Card>
                    </Col>
                    <Col>
                      <Card
                        body
                        className="bg-transparent border-primary rounded-0"
                        style={{
                          height: "100%",
                        }}
                      >
                        <p
                          className={
                            "display-5 text-center " +
                            (installedExploiter ? "text-white" : "")
                          }
                        >
                          Exploit FTP
                        </p>
                        <div className="d-grid">
                          <Card
                            body
                            className="mb-3 bg-transparent border-primary text-white text-center"
                          >
                            {!installedExploiter ? (
                              <span>You need to install an exploiter</span>
                            ) : (
                              <ListGroup>
                                <ListGroup.Item>
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
                                            strength:
                                              cur.strength + prev.strength,
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
                            variant={
                              !installedExploiter ? "secondary" : "primary"
                            }
                            disabled={!installedExploiter}
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
          </Card>
        </>
      ) : (
        <>
          <Card body className="rounded-0 bg-transparent border-secondary p-1">
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
                {!access ? (
                  <Button
                    className="bg-success rounded-0"
                    size="sm"
                    onClick={() => {
                      setIsHacking(true);
                    }}
                  >
                    Hack
                  </Button>
                ) : (
                  <Button
                    className="bg-success rounded-0"
                    size="sm"
                    onClick={() => {
                      setIsHacking(true);
                    }}
                  >
                    Login
                  </Button>
                )}
                <div
                  className="d-grid bg-black border border-success p-3"
                  style={{
                    fontFamily: "initial",
                    minHeight: "70vh",
                    height: "100%",
                  }}
                >
                  {!markdown || markdown.length === 0 ? (
                    <>
                      <p>Missing document...</p>
                    </>
                  ) : (
                    <iframe
                      sandbox="allow-scripts"
                      srcDoc={`
                        <script>
                          window.computer = ${JSON.stringify(computer)}
                        </script>
                        ${markdown}
                        <script>                   
                            let elements = document.getElementsByTagName('span');
                            
                            for(let i = 0; i < elements.length; i++){
                              let elm = elements[i];   
                              if(elm.getAttribute('data-computer'))
                                elm.innerHTML = window.computer[elm.getAttribute('data-computer')]
                            }
                        </script>
                        `}
                      style={{
                        width: "100%",
                        height: "100%",
                        background: "white",
                        overflowX: "hidden",
                        overflowY: "scroll",
                      }}
                    ></iframe>
                  )}
                </div>
              </>
            )}
          </Card>
        </>
      )}
      {valid && computer ? (
        <p className="text-white bg-secondary pb-1 ps-1">
          <span className="badge bg-black rounded-0">
            PC NAME: {computer.data.title}
          </span>
          {access ? (
            <span className="ms-1 badge bg-success rounded-0">
              Hacked (
              {
                (
                  access as {
                    access: "GOD" | "FTP";
                  }
                )?.access
              }
              )
            </span>
          ) : (
            <span
              className="ms-1 badge bg-danger rounded-0"
              onClick={() => {
                setIsHacking(true);
              }}
            >
              Unhacked
            </span>
          )}
        </p>
      ) : (
        <></>
      )}
    </>
  );
}

Display.propTypes = {};

export default Display;

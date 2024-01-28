import React, { useCallback, useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  Button,
  ButtonToolbar,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Nav,
  Navbar,
  Row,
  NavDropdown,
  Alert,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Computer } from "../../lib/types/computer.type";
import GameContext from "../../contexts/game.context";
import { postRequestHandler } from "../../lib/submit";
import toast from "react-hot-toast";

export default function Browser() {
  const game = useContext(GameContext);
  const { ip } = useParams();
  const [computer, setComputer] = useState<Computer | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("Unknown");
  const [valid, setValid] = useState(false);
  const [connectionId, setConnectionId] = useState(game.connections?.[0]?.id);
  const [history, setHistory] = useState<Record<string, string>>({});
  const [currentIp, setCurrentIp] = useState("");

  const fetchHomepage = useCallback(
    async (ip: string, connectionId: string) => {
      const result = await postRequestHandler<{
        computer: Computer;
        markdown: string;
        title: string;
      }>("/internet/homepage", {
        ip,
        connectionId,
      });

      return result.data;
    },
    []
  );

  useEffect(() => {
    if (!fetchHomepage) return;
    if (!ip) return;
    if (!connectionId) return;

    const history = JSON.parse(localStorage.getItem("history") || "{}") || {};
    setHistory(history);
    setCurrentIp(history?.[connectionId] || ip);

    const promise = fetchHomepage(ip, connectionId).then((data) => {
      if (!data) setValid(false);
      else {
        setHistory({
          ...history,
          [connectionId]: ip,
        });
        setComputer(data.computer);
        setMarkdown(data.markdown);
        setTitle(data.title);
        setValid(true);

        localStorage.setItem(
          "history",
          JSON.stringify({
            ...history,
            [connectionId]: ip,
          })
        );
      }
    });
    toast.promise(promise, {
      loading: "Fetching " + ip,
      success: "Success",
      error: "Failure",
    });
  }, [fetchHomepage, ip, connectionId]);

  return (
    <Layout fluid={true}>
      <Row>
        <Col>
          <Navbar bg="dark" data-bs-theme="dark">
            <Container fluid>
              <NavDropdown
                title={
                  <span className="badge bg-success m-2">
                    {connectionId
                      ? game.connections.find(
                          (that) => that.id === connectionId
                        )?.ip
                      : "?"}
                  </span>
                }
              >
                {game.connections.map((connection) => (
                  <NavDropdown.Item
                    onClick={() => {
                      setConnectionId(connection.id);
                      if (history[connection.id]) {
                        setValid(false);
                        fetchHomepage(
                          history[connection.id],
                          connection.id
                        ).then((data) => {
                          if (!data) setValid(false);
                          else {
                            setComputer(data.computer);
                            setMarkdown(data.markdown);
                            setTitle(data.title);
                            setCurrentIp(data.computer.ip);
                            setValid(true);

                            localStorage.setItem(
                              "history",
                              JSON.stringify({
                                ...history,
                                [connectionId]: ip,
                              })
                            );
                          }

                          setValid(true);
                        });
                      } else {
                        setCurrentIp("");
                        setValid(false);
                      }
                    }}
                    className={
                      connectionId === connection.id ? "bg-success" : ""
                    }
                  >
                    {connection.ip}{" "}
                    {history[connection.id] ? (
                      <span
                        className={
                          " ms-2 badge " +
                          (connectionId === connection.id
                            ? "bg-secondary"
                            : "bg-danger")
                        }
                      >
                        {history[connection.id]}
                      </span>
                    ) : (
                      <></>
                    )}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <Nav className="me-auto mx-auto">
                <ButtonToolbar aria-label="Toolbar with Button groups">
                  <InputGroup
                    style={{
                      width: "75vw",
                    }}
                  >
                    <InputGroup.Text id="btnGroupAddon" className="rounded-0">
                      <Button
                        size="sm"
                        className="rounded-0 bg-transparent border-0"
                      >
                        Reload
                      </Button>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      className="rounded-0"
                      placeholder={computer?.ip || ""}
                      value={currentIp}
                      name="addressbar"
                      onChange={(e) => {
                        setCurrentIp(e.target.value);
                      }}
                      aria-label="Input group example"
                      aria-describedby="btnGroupAddon"
                    />
                    <InputGroup.Text id="btnGroupAddon" className="rounded-0">
                      <Button
                        onClick={() => {
                          if (!currentIp) return;
                          setValid(false);

                          const promise = fetchHomepage(
                            currentIp.trim(),
                            connectionId
                          ).then((data) => {
                            if (!data) setValid(false);
                            else {
                              setComputer(data.computer);
                              setMarkdown(data.markdown);
                              setTitle(data.title);
                              setHistory({
                                ...history,
                                [connectionId]: currentIp,
                              });
                              setValid(true);

                              localStorage.setItem(
                                "history",
                                JSON.stringify({
                                  ...history,
                                  [connectionId]: ip,
                                })
                              );
                            }
                            setValid(true);
                          });
                          toast.promise(promise, {
                            loading: "Fetching " + currentIp,
                            success: "Success",
                            error: "Failure",
                          });
                        }}
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
          <Card body className="rounded-0 bg-transparent border-secondary p-1">
            {!valid ? (
              <Alert
                variant="danger"
                className="text-center bg-transparent border-danger border mt-0 mb-0 rounded-0"
                style={{ fontFamily: "initial" }}
              >
                <p className="display-2">404</p>
                <p>This website does not exist</p>
              </Alert>
            ) : (
              <div
                className="d-grid bg-black border border-success p-3"
                style={{ fontFamily: "initial" }}
              >
                {!markdown || markdown.length === 0 ? (
                  <>
                    <h1 className="text-black">Default Homepage</h1>
                    <p>Please contact the administrator</p>
                  </>
                ) : (
                  <>{markdown}</>
                )}
              </div>
            )}
          </Card>
          {valid ? (
            <p className="text-white bg-secondary pb-1 ps-1">
              <span className="badge bg-black rounded-0">PC NAME: {title}</span>
            </p>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

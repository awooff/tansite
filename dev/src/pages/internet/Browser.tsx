import React, { useCallback, useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  Button,
  ButtonToolbar,
  Col,
  Container,
  Form,
  InputGroup,
  Nav,
  NavDropdown,
  Navbar,
  Row,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Computer } from "../../lib/types/computer.type";
import GameContext from "../../contexts/game.context";
import { postRequestHandler } from "../../lib/submit";
import toast from "react-hot-toast";
import Homepage from "../../components/internet/Homepage";
import SearchEngine from "../../components/internet/SearchEngine";
import Hacking from "../../components/internet/Hacking";

export type HomepageRequest = {
  computer: Computer;
  markdown: string;
  title: string;
  access?: object;
};

export default function Browser() {
  const game = useContext(GameContext);
  const { ip } = useParams();
  const [computer, setComputer] = useState<Computer | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [valid, setValid] = useState(false);
  const [connectionId, setConnectionId] = useState(
    game?.connections?.find(
      (that) => that.id === localStorage.getItem("currentConnectionId")
    )?.id || game.connections?.[0]?.id
  );
  const [history, setHistory] = useState<
    Record<
      string,
      {
        ip: string;
        tab: string;
      }
    >
  >({});
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const [access, setAccess] = useState<object | null>(null);
  const [currentAddress, setCurrentAddress] = useState("");
  const [tab, setTab] = useState("homepage");
  const [session, setSession] = useState<Record<string, string[]>>({});

  const fetchHomepage = useCallback(
    async (ip: string, connectionId: string) => {
      let query = ip.trim();
      let isDomain = false;
      if (
        query.startsWith("www.") ||
        query.endsWith(".com") ||
        query.endsWith(".net") ||
        query.endsWith(".co.uk") ||
        query.endsWith(".gov")
      )
        isDomain = true;

      const result = await postRequestHandler<HomepageRequest>(
        "/internet/homepage",
        {
          domain: isDomain ? query : undefined,
          ip: !isDomain ? query : undefined,
          connectionId,
        }
      );

      return result.data;
    },
    []
  );

  useEffect(() => {
    const newIp = ip || currentIp || "0.0.0.0";
    if (
      (newIp !== currentIp && !currentIp) ||
      (currentIp === "0.0.0.0" && ip !== "0.0.0.0")
    ) {
      setValid(false);
      setCurrentIp(newIp);
    }
  }, [ip, connectionId, currentIp]);

  useEffect(() => {
    if (!fetchHomepage) return;
    if (!connectionId) return;
    if (!currentIp) return;

    const history = JSON.parse(localStorage.getItem("history") || "{}") || {};

    setHistory((prev) => {
      return {
        ...prev,
        ...history,
      };
    });

    if (currentIp === "0.0.0.0" && history[connectionId]) {
      setCurrentIp(history[connectionId].ip);
      setTab(history[connectionId].tab || "homepage");
      return;
    }

    const promise = fetchHomepage(currentIp, connectionId).then(
      (data: HomepageRequest) => {
        if (!data) setValid(false);
        else {
          setTab(history[connectionId]?.tab || tab || "homepage");
          setHistory({
            ...history,
            [connectionId]: {
              ip: currentIp,
              tab: history[connectionId]?.tab || tab || "homepage",
            },
          });
          setComputer(data.computer);
          setMarkdown(data.markdown);
          setAccess(data.access || null);
          setValid(true);
          setCurrentAddress(currentIp);

          setSession((prev) => {
            if (!prev[connectionId]) prev[connectionId] = [];

            if (!prev[connectionId].includes(currentIp))
              prev[connectionId].push(currentIp);

            return prev;
          });

          localStorage.setItem(
            "history",
            JSON.stringify({
              ...history,
              [connectionId]: {
                ip: currentIp,
                tab: history[connectionId]?.tab || tab || "homepage",
              },
            })
          );
        }
      }
    );
    toast.promise(promise, {
      loading: "Fetching " + currentIp,
      success: "Success",
      error: "Failure",
    });
  }, [fetchHomepage, currentIp, connectionId]);

  console.log(session);
  return (
    <Layout fluid={true}>
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
                  onClick={() => {
                    localStorage.setItem("currentConnectionId", connection.id);

                    if (history[connection.id]) {
                      if (currentIp !== history[connection.id].ip)
                        setValid(false);

                      setCurrentIp(history[connection.id].ip);
                      setCurrentAddress(history[connection.id].ip);
                    } else {
                      setCurrentIp("0.0.0.0");
                      setValid(false);
                    }

                    setConnectionId(connection.id);
                  }}
                  className={connectionId === connection.id ? "bg-success" : ""}
                >
                  <span className={"me-2 badge rounded-0 bg-transparent"}>
                    #{index}
                  </span>
                  <b className="border-bottom border-white me-2">
                    {connection.ip}{" "}
                  </b>{" "}
                  <span className={"badge rounded-0 bg-black"}>
                    {connection.data?.title}
                  </span>
                  {history[connection.id] ? (
                    <>
                      <br />
                      <span
                        className={
                          "mt-1 badge rounded-0 " +
                          (connectionId === connection.id
                            ? "bg-transparent"
                            : "bg-transparent")
                        }
                      >
                        📄 On tab {history[connection.id].tab} @{" "}
                        {history[connection.id].ip}
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
            <ButtonToolbar aria-label="Search Bar">
              <InputGroup
                style={{
                  width: "62vw",
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
                    if (e.key === "Enter") {
                      if (currentAddress.trim() === currentIp?.trim()) return;

                      setValid(false);
                      setCurrentIp(currentAddress);
                    }
                  }}
                  onChange={(e) => {
                    setCurrentAddress(e.target.value);
                  }}
                  aria-label="Input group example"
                  aria-describedby="btnGroupAddon"
                />
                <InputGroup.Text id="btnGroupAddon" className="rounded-0">
                  <Button
                    onClick={() => {
                      if (currentAddress.trim() === currentIp?.trim()) return;

                      setValid(false);
                      setCurrentIp(currentAddress);
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
          <Nav className="me-auto mx-auto">
            <NavDropdown title={"📖"}>
              {session?.[connectionId]?.map((session, index) => (
                <NavDropdown.Item
                  onClick={() => {
                    setCurrentIp(session);
                  }}
                >
                  <span className="badge bg-secondary me-2">{index}</span>
                  {session}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
          <Nav className="me-auto mx-auto">
            <ButtonToolbar aria-label="Search Bar">
              <InputGroup>
                <InputGroup.Text id="btnGroupAddon" className="rounded-0">
                  <Button
                    disabled={
                      session?.[connectionId]?.length === 1 || currentIp
                        ? session?.[connectionId]?.indexOf(
                            currentIp !== null ? currentIp : "0.0.0.0"
                          ) === 0
                        : false
                    }
                    onClick={() => {
                      setCurrentIp(
                        session?.[connectionId]?.[
                          session?.[connectionId]?.indexOf(
                            currentIp !== null ? currentIp : "0.0.0.0"
                          ) - 1
                        ] ||
                          session?.[connectionId]?.[
                            session?.[connectionId].length - 1
                          ]
                      );
                    }}
                    size="sm"
                    className="rounded-0 bg-transparent border-0"
                  >
                    Back
                  </Button>
                </InputGroup.Text>
                <InputGroup.Text id="btnGroupAddon" className="rounded-0">
                  <Button
                    disabled={
                      session?.[connectionId]?.length === 1 || currentIp
                        ? session?.[connectionId]?.indexOf(
                            currentIp !== null ? currentIp : "0.0.0.0"
                          ) ===
                          session?.[connectionId]?.length - 1
                        : false
                    }
                    onClick={() => {
                      setCurrentIp(
                        session?.[connectionId]?.[
                          session?.[connectionId]?.indexOf(
                            currentIp !== null ? currentIp : "0.0.0.0"
                          ) + 1
                        ] ||
                          session?.[connectionId]?.[
                            session?.[connectionId].length - 1
                          ]
                      );
                    }}
                    size="sm"
                    className="rounded-0 bg-transparent border-0"
                  >
                    Foward
                  </Button>
                </InputGroup.Text>
              </InputGroup>
            </ButtonToolbar>
          </Nav>
        </Container>
      </Navbar>
      <Row className="mt-1">
        <Col>
          {computer?.type === "search_engine" && tab === "homepage" ? (
            <SearchEngine
              computer={computer}
              connectionId={connectionId}
              valid={valid}
              access={access}
              setCurrentIp={setCurrentIp}
              ip={currentIp || "0.0.0.0"}
              markdown={markdown}
              setTab={(tab: string) => {
                let newHistory = {
                  ...history,
                  [connectionId]: {
                    ...history[connectionId],
                    tab: tab,
                  },
                };
                localStorage.setItem("history", JSON.stringify(newHistory));
                setTab(tab);
                setHistory(history);
              }}
            />
          ) : (
            <>
              {(() => {
                if (tab === "homepage")
                  return (
                    <Homepage
                      computer={computer}
                      connectionId={connectionId}
                      valid={valid}
                      access={access}
                      ip={currentIp || "0.0.0.0"}
                      markdown={markdown}
                      setTab={(tab: string) => {
                        let newHistory = {
                          ...history,
                          [connectionId]: {
                            ...history[connectionId],
                            tab: tab,
                          },
                        };
                        localStorage.setItem(
                          "history",
                          JSON.stringify(newHistory)
                        );
                        setTab(tab);
                        setHistory(newHistory);
                      }}
                    />
                  );

                if (tab === "hack")
                  return (
                    <Hacking
                      computer={computer}
                      connectionId={connectionId}
                      valid={valid}
                      access={access}
                      ip={currentIp || "0.0.0.0"}
                      markdown={markdown}
                      setTab={(tab: string) => {
                        let newHistory = {
                          ...history,
                          [connectionId]: {
                            ...history[connectionId],
                            tab: tab,
                          },
                        };
                        localStorage.setItem(
                          "history",
                          JSON.stringify(newHistory)
                        );
                        setTab(tab);
                        setHistory(newHistory);
                      }}
                    />
                  );
              })()}
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
                <span className="ms-1 badge bg-danger rounded-0">Unhacked</span>
              )}
            </p>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Layout from "../../components/Layout";
import {
  Button,
  ButtonToolbar,
  Alert,
  Col,
  Container,
  Form,
  InputGroup,
  Nav,
  NavDropdown,
  Navbar,
  Row,
} from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Computer } from "../../lib/types/computer.type";
import GameContext from "../../contexts/game.context";
import { postRequestHandler } from "../../lib/submit";
import toast from "react-hot-toast";
import Homepage from "../../components/internet/Homepage";
import SearchEngine from "../../components/internet/SearchEngine";
import Hacking from "../../components/internet/Hacking";
import Connection from "../../components/internet/Connection";
import SessionContext from "../../contexts/session.context";
import Logs from "../../components/internet/Logs";
import Files from "../../components/internet/Files";

export type HomepageRequest = {
  computer: Computer;
  markdown: string;
  title: string;
  access?: object;
};

export default function Browser() {
  const game = useContext(GameContext);
  const session = useContext(SessionContext);
  const { ip: target } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [computer, setComputer] = useState<Computer | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectionId, setConnectionId] = useState(
    location?.state?.connectionId ||
      game?.connections?.find(
        (that) => that.id === localStorage.getItem("currentConnectionId")
      )?.id
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
  const [currentIp, setCurrentIp] = useState<string | null>("0.0.0.0");
  const [access, setAccess] = useState<object | null>(null);
  const currentAddress = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState("homepage");
  const [browserSession, setBrowserSession] = useState<
    Record<string, string[]>
  >({});

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
    if (!target) return;
    if (!currentIp) return;

    if (currentIp === "0.0.0.0" && currentIp !== target) {
      setValid(false);
      setCurrentIp(target);
    }
  }, [target, currentIp]);

  const loadBrowser = useCallback(
    async (ip: string) => {
      setLoading(true);

      let data = await fetchHomepage(ip, connectionId);

      if (!data) setValid(false);
      else {
        setAccess(data.access || null);

        if (data.access && history[connectionId]?.tab === "hack")
          history[connectionId].tab = "login";
        else if (!data.access && history[connectionId]?.tab === "login")
          history[connectionId].tab = "homepage";

        setTab(history[connectionId]?.tab || "homepage");
        setHistory({
          ...history,
          [connectionId]: {
            ip: ip,
            tab: history[connectionId]?.tab || "homepage",
          },
        });
        setComputer(data.computer);
        setMarkdown(data.markdown);
        setBrowserSession((prev) => {
          if (!prev[connectionId]) prev[connectionId] = [];

          if (!prev[connectionId].includes(ip)) prev[connectionId].push(ip);

          return prev;
        });

        if (currentAddress.current && currentAddress?.current?.value !== ip)
          currentAddress.current.value = ip;

        localStorage.setItem(
          "history",
          JSON.stringify({
            ...history,
            [connectionId]: {
              ip: ip,
              tab: history[connectionId]?.tab || tab || "homepage",
            },
          })
        );

        setValid(true);
        setLoading(false);

        return data;
      }
    },
    [history]
  );

  useEffect(() => {
    if (!connectionId) return;

    const history = JSON.parse(localStorage.getItem("history") || "{}") || {};
    setHistory((prev) => {
      return {
        ...prev,
        ...history,
      };
    });

    if (
      !currentIp ||
      (currentIp == "0.0.0.0" &&
        history[connectionId] &&
        currentIp !== history[connectionId].ip)
    ) {
      setCurrentIp(history[connectionId].ip);
      setTab(history[connectionId].tab || "homepage");
      return;
    }

    if (currentIp)
      toast.promise(loadBrowser(currentIp), {
        loading: "Fetching " + currentIp,
        success: "Success",
        error: "Failure",
      });
  }, [currentIp, connectionId]);

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
              <div className="d-grid" key={index}>
                <NavDropdown.Item
                  style={{
                    fontSize: 12,
                  }}
                  onClick={() => {
                    localStorage.setItem("currentConnectionId", connection.id);
                    setConnectionId(connection.id);
                    setCurrentIp("0.0.0.0");
                    setValid(false);
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
                  {session.data.logins?.[connection.id]?.map((connection) => (
                    <>
                      <br />
                      <span className={"mt-1 badge rounded-0 "}>
                        ✅ Active Connection @{" "}
                        <a
                          className="text-white"
                          href={"#navigate:/internet/browser/" + connection.ip}
                        >
                          <u>{connection.ip}</u>
                        </a>
                      </span>
                    </>
                  ))}
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
                  name="addressbar"
                  onKeyUp={(e) => {
                    if (e.key === "Enter" && currentAddress.current) {
                      if (
                        currentAddress.current.value.trim() ===
                        currentIp?.trim()
                      )
                        return;

                      if (access) setTab("homepage");

                      setValid(false);
                      setCurrentIp(currentAddress.current.value);
                    }
                  }}
                  ref={currentAddress}
                  aria-label="Input group example"
                  aria-describedby="btnGroupAddon"
                />
                <InputGroup.Text id="btnGroupAddon" className="rounded-0">
                  <Button
                    onClick={() => {
                      if (
                        !currentAddress.current?.value ||
                        currentAddress.current.value.trim() ===
                          currentIp?.trim()
                      )
                        return;

                      if (access) setTab("homepage");

                      setValid(false);
                      setCurrentIp(currentAddress?.current?.value);
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
              {browserSession?.[connectionId]?.map((session, index) => (
                <NavDropdown.Item
                  key={index}
                  onClick={() => {
                    setCurrentIp(session);
                    setValid(false);
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
                      browserSession?.[connectionId]?.length === 1 || currentIp
                        ? browserSession?.[connectionId]?.indexOf(
                            currentIp !== null ? currentIp : "0.0.0.0"
                          ) === 0
                        : false
                    }
                    onClick={() => {
                      setCurrentIp(
                        browserSession?.[connectionId]?.[
                          browserSession?.[connectionId]?.indexOf(
                            currentIp !== null ? currentIp : "0.0.0.0"
                          ) - 1
                        ] ||
                          browserSession?.[connectionId]?.[
                            browserSession?.[connectionId].length - 1
                          ]
                      );
                      setValid(false);
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
                      browserSession?.[connectionId]?.length === 1 || currentIp
                        ? browserSession?.[connectionId]?.indexOf(
                            currentIp !== null ? currentIp : "0.0.0.0"
                          ) ===
                          browserSession?.[connectionId]?.length - 1
                        : false
                    }
                    onClick={() => {
                      setCurrentIp(
                        browserSession?.[connectionId]?.[
                          browserSession?.[connectionId]?.indexOf(
                            currentIp !== null ? currentIp : "0.0.0.0"
                          ) + 1
                        ] ||
                          browserSession?.[connectionId]?.[
                            browserSession?.[connectionId].length - 1
                          ]
                      );
                      setValid(false);
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
      {game.connections.length === 0 ? (
        <Row>
          <Col>
            <Alert
              variant="danger"
              className="text-center bg-transparent border-danger border mt-0 mb-0 rounded-0"
              style={{ fontFamily: "initial" }}
            >
              <p className="display-2">403</p>
              <p>
                You need to select which computer you would like to surf the
                internet with!
              </p>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/computers/connections", {
                    state: {
                      return: "/internet/browser/" + currentIp,
                    },
                  });
                }}
              >
                View your connections
              </a>
            </Alert>
          </Col>
        </Row>
      ) : (
        <>
          {!loading ? (
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
                      localStorage.setItem(
                        "history",
                        JSON.stringify(newHistory)
                      );
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
                            computer={
                              session.data?.logins?.[connectionId]?.find(
                                (that) => that.id === computer?.id
                              ) || computer
                            }
                            connectionId={connectionId}
                            valid={valid}
                            access={access}
                            ip={currentIp || "0.0.0.0"}
                            markdown={markdown}
                            setTab={(tab: string) => {
                              setHistory((history) => {
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
                                return newHistory;
                              });
                              setTab(tab);
                            }}
                          />
                        );
                      else if (tab === "connection")
                        return (
                          <Connection
                            computer={
                              session.data?.logins?.[connectionId]?.find(
                                (that) => that.id === computer?.id
                              ) || computer
                            }
                            connectionId={connectionId}
                            valid={valid}
                            access={access}
                            ip={currentIp || "0.0.0.0"}
                            markdown={markdown}
                            setTab={(tab: string) => {
                              setHistory((history) => {
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
                                return newHistory;
                              });
                              setTab(tab);
                            }}
                          />
                        );
                      else if (tab === "hack")
                        return (
                          <Hacking
                            computer={
                              session.data?.logins?.[connectionId]?.find(
                                (that) => that.id === computer?.id
                              ) || computer
                            }
                            connectionId={connectionId}
                            valid={valid}
                            access={access}
                            fetchHomepage={async (ip, connectionId) => {
                              setConnectionId(connectionId);

                              let result = await loadBrowser(ip);
                              if (!result) throw new Error("invalid fetch");

                              return result;
                            }}
                            ip={currentIp || "0.0.0.0"}
                            markdown={markdown}
                            setTab={(tab: string) => {
                              setHistory((history) => {
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
                                return newHistory;
                              });
                              setTab(tab);
                            }}
                          />
                        );
                      else if (tab === "logs")
                        return (
                          <Logs
                            computer={
                              session.data?.logins?.[connectionId]?.find(
                                (that) => that.id === computer?.id
                              ) || computer
                            }
                            connectionId={connectionId}
                            valid={valid}
                            access={access}
                            ip={currentIp || "0.0.0.0"}
                            markdown={markdown}
                            setTab={(tab: string) => {
                              setHistory((history) => {
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
                                return newHistory;
                              });
                              setTab(tab);
                            }}
                          />
                        );
                      else if (tab === "files")
                        return (
                          <Files
                            connectionId={connectionId}
                            valid={valid}
                            access={access}
                            ip={currentIp || "0.0.0.0"}
                            markdown={markdown}
                            setTab={(tab: string) => {
                              setHistory((history) => {
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
                                return newHistory;
                              });
                              setTab(tab);
                            }}
                          />
                        );
                      else
                        return (
                          <>
                            <Alert
                              variant="danger"
                              className="bg-transparent border-danger border"
                            >
                              Invalid tab
                              <br />
                              <Button
                                className="mt-2"
                                variant="danger"
                                onClick={() => {
                                  setTab("homepage");
                                }}
                              >
                                Go back to homepage
                              </Button>
                            </Alert>
                          </>
                        );
                    })()}
                  </>
                )}
                {valid && computer ? (
                  <p className="text-white bg-secondary pb-1 ps-1">
                    <span className="badge bg-black rounded-0">
                      {computer.type}
                    </span>{" "}
                    |
                    <span
                      className="ms-1 badge bg-primary rounded-0"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate("/computers/files/" + connectionId, {
                          state: {
                            return: "/internet/browser/" + currentIp,
                          },
                        });
                      }}
                    >
                      View Your HDD
                    </span>
                    <span
                      className="ms-1 badge bg-primary rounded-0"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        navigate("/computers/logs/" + connectionId, {
                          state: {
                            return: "/internet/browser/" + currentIp,
                          },
                        });
                      }}
                    >
                      View Your Logs
                    </span>{" "}
                    |
                    {session.data.logins?.[connectionId]?.length !== 0 ? (
                      session.data.logins?.[connectionId]?.map((login) => (
                        <span
                          className="ms-1 badge bg-success rounded-0"
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setCurrentIp(login.ip);
                          }}
                        >
                          🌎 {login.ip}{" "}
                          <span className="badge bg-black rounded-0">
                            {login.data?.title || "Unknown"}
                          </span>
                        </span>
                      ))
                    ) : (
                      <></>
                    )}
                    {access ? (
                      <span
                        className="me-1 mt-1 badge bg-success rounded-0"
                        style={{
                          float: "right",
                        }}
                      >
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
                        className="me-1 mt-1 badge bg-danger rounded-0"
                        style={{
                          float: "right",
                        }}
                      >
                        Unhacked
                      </span>
                    )}
                  </p>
                ) : (
                  <></>
                )}
              </Col>
            </Row>
          ) : (
            <>
              <Alert
                variant="danger"
                className="text-center bg-transparent border-info border mt-0 mb-0 rounded-0"
              >
                <Row className="justify-content-center mb-4">
                  <Col lg={3}>
                    <img src="/icons/query.png" className="mx-auto img-fluid" />
                  </Col>
                </Row>
                <p className="display-2">Fetching {currentIp}</p>
                <p>Please wait for the index.html to be downloaded...</p>
              </Alert>
            </>
          )}
        </>
      )}
    </Layout>
  );
}

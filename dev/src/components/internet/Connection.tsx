import React, { useContext, useState } from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import { Computer } from "../../lib/types/computer.type";
import { Process } from "../../lib/types/process.type";
import { createProcess } from "../../lib/process";
import SessionContext from "../../contexts/session.context";

function Connection({
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
  const session = useContext(SessionContext);
  const [process, setProcess] = useState<Process | null>(null);
  const [error, setError] = useState<Error | null>(null);

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
    <>
      {!computer ? (
        <Alert
          variant="danger"
          className="text-center bg-transparent border-info border mt-0 mb-0 rounded-0"
        >
          <Row className="justify-content-center mb-4">
            <Col lg={3}>
              <img src="/icons/info.png" className="mx-auto img-fluid" />
            </Col>
          </Row>
          <p className="display-2">LOADING</p>
          <p>Please wait for the connection interface to be initialized...</p>
        </Alert>
      ) : (
        <>
          {error ? (
            <Alert variant="danger">{error.message || error.toString()}</Alert>
          ) : (
            <></>
          )}
          {process ? (
            <Alert
              variant="primary"
              className="bg-transparent border-primary border pb-2"
            >
              <Row>
                <Col className="display-4 text-center">⚙️</Col>
                <Col lg={10}>
                  <h5>Executing {process.type}</h5>
                  <p
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    Time remaining:{" "}
                    {Math.floor(
                      (new Date(process.completion).getTime() - Date.now()) /
                        1000
                    )}{" "}
                    seconds
                  </p>
                </Col>
              </Row>
            </Alert>
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
          <Button className="rounded-0" size="sm" variant="primary">
            Connection
          </Button>
          <Button
            className="rounded-0"
            variant="warning"
            size="sm"
            disabled={
              session.data.logins?.[connectionId]?.find(
                (login) => login.id === computer.id
              ) === undefined
            }
            onClick={() => {
              setTab("files");
            }}
          >
            Files
          </Button>
          <Button
            className="rounded-0"
            variant="info"
            size="sm"
            disabled={
              session.data.logins?.[connectionId]?.find(
                (login) => login.id === computer.id
              ) === undefined
            }
            onClick={() => {
              setTab("logs");
            }}
          >
            Logs
          </Button>
          <div className="d-grid bg-black border border-primary p-3 browser-frame">
            <Row>
              <Col>
                <Card
                  body
                  className={
                    "bg-transparent rounded-0 " +
                    (session.data.logins?.[connectionId]?.find(
                      (login) => login.id === computer.id
                    ) !== undefined
                      ? "border-secondary"
                      : "border-success")
                  }
                  style={{
                    height: "100%",
                    filter:
                      session.data.logins?.[connectionId]?.find(
                        (login) => login.id === computer.id
                      ) !== undefined
                        ? "blur(12px)"
                        : "",
                  }}
                >
                  <div className="d-grid gap-2">
                    <img
                      className="img-fluid mx-auto"
                      src="/icons/connect.png"
                    ></img>
                    <Card
                      body
                      className="mb-3 bg-transparent border-secondary rounded-0 text-white text-center"
                    >
                      $ connect {computer.ip}
                    </Card>
                    <Button
                      variant={
                        session.data.logins?.[connectionId]?.find(
                          (login) => login.id === computer.id
                        ) !== undefined
                          ? "secondary"
                          : "success"
                      }
                      disabled={
                        session.data.logins?.[connectionId]?.find(
                          (login) => login.id === computer.id
                        ) !== undefined
                      }
                      onClick={async () => {
                        setError(null);
                        try {
                          await createProcess(
                            "login",
                            {
                              ip: computer.ip,
                              connectionId: connectionId,
                            },
                            true,
                            (process) => {
                              setProcess(process);
                            }
                          ).finally(() => {
                            setProcess(null);
                          });
                          await session.load();
                          setTab("logs");
                        } catch (err: any) {
                          setError(new Error(err));
                          setTimeout(() => {
                            setError(null);
                          }, 3000);
                        }
                      }}
                    >
                      Connect
                    </Button>
                  </div>
                </Card>
              </Col>
              <Col>
                <Card
                  body
                  className={
                    "bg-transparent rounded-0 " +
                    (session.data.logins?.[connectionId]?.find(
                      (login) => login.id === computer.id
                    ) === undefined
                      ? "border-secondary"
                      : "border-danger")
                  }
                  style={{
                    height: "100%",
                    filter:
                      session.data.logins?.[connectionId]?.find(
                        (login) => login.id === computer.id
                      ) === undefined
                        ? "blur(12px)"
                        : "",
                  }}
                >
                  <div className="d-grid gap-2">
                    <img
                      className="img-fluid mx-auto"
                      src="/icons/disconnect.png"
                    ></img>
                    <Card
                      body
                      className="mb-3 bg-transparent border-secondary rounded-0 text-white text-center"
                    >
                      $ disconnect {computer.ip}
                    </Card>
                    <Button
                      variant={
                        session.data.logins?.[connectionId]?.find(
                          (login) => login.id === computer.id
                        ) === undefined
                          ? "secondary"
                          : "danger"
                      }
                      disabled={
                        session.data.logins?.[connectionId]?.find(
                          (login) => login.id === computer.id
                        ) === undefined
                      }
                      onClick={async () => {
                        setError(null);
                        try {
                          await createProcess(
                            "logout",
                            {
                              ip: computer.ip,
                              connectionId: connectionId,
                            },
                            true,
                            (process) => {
                              setProcess(process);
                            }
                          ).finally(() => {
                            setProcess(null);
                          });
                          await session.load();
                          setTab("homepage");
                        } catch (err: any) {
                          setError(new Error(err));
                          setTimeout(() => {
                            setError(null);
                          }, 3000);
                        }
                      }}
                    >
                      Disconnect
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

Connection.propTypes = {};

export default Connection;

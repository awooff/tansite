import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import { Computer } from "../../lib/types/computer.type";
import { Process } from "../../lib/types/process.type";
import { createProcess } from "../../lib/process";
import SessionContext from "../../contexts/session.context";
import LogComponent from "../LogComponent";

function Logs({
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

  useEffect(() => {
    if (!computer) return;
    if (!session.loaded) return;

    if (
      !session.data.logins[connectionId]?.find(
        (that) => that.id === computer.id
      )
    )
      setTab("homepage");
  }, [session, computer]);

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
          <p>Please wait for the logs to be downloaded...</p>
          <Row className="justify-content-center mb-4">
            <Col lg={2}>
              <div className="d-grid">
                <Button
                  variant="danger"
                  onClick={() => {
                    session
                      .load()
                      .finally(() => {
                        setTab("homepage");
                      })
                      .catch((error: Error) => {
                        console.log(error);
                      });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Col>
          </Row>
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
          <Button
            className="rounded-0"
            size="sm"
            variant="primary"
            onClick={() => {
              setTab("connection");
            }}
          >
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
          >
            Logs
          </Button>
          <div className="d-grid bg-black border border-info p-3 browser-frame">
            <Row>
              <Col>
                {computer.id ? (
                  <>
                    <LogComponent ip={ip} connectionId={connectionId} />
                  </>
                ) : (
                  <Alert variant="danger">Invalid computer</Alert>
                )}
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
}

Logs.propTypes = {};

export default Logs;

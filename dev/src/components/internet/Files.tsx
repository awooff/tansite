import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import { Computer } from "../../lib/types/computer.type";
import { Process } from "../../lib/types/process.type";
import { createProcess } from "../../lib/process";
import SessionContext from "../../contexts/session.context";
import FileComponent from "../FileComponent";
import { postRequestHandler } from "../../lib/submit";

function Files({
  connectionId,
  ip,
  markdown,
  valid,
  access,
  setTab,
}: {
  connectionId: string;
  ip: string;
  markdown: string;
  valid: boolean;
  access: object | null;
  setTab: (tab: string) => void;
}) {
  const session = useContext(SessionContext);
  const [process, setProcess] = useState<Process | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [computer, setComputer] = useState<Computer>();

  useEffect(() => {
    if (!ip) return;
    if (!connectionId) return;
    if (!session.data.logins[connectionId]?.find((that) => that.ip === ip))
      setTab("homepage");
  }, [session, computer]);

  const fetchFiles = useCallback(async (ip: string, connectionId: string) => {
    let result = await postRequestHandler<{
      computer: Computer;
    }>("/internet/fetch", {
      ip,
      connectionId,
    });
    return result.data.computer;
  }, []);

  useEffect(() => {
    if (!ip || !connectionId || !valid) return;

    fetchFiles(ip, connectionId).then((computer) => setComputer(computer));
  }, [ip, connectionId, valid]);

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
      {!computer?.software ? (
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
          <p>Please wait for the file tree to be downloaded...</p>
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
          <div className="d-grid bg-black border border-warning p-3 browser-frame">
            <FileComponent
              onCompletion={() => {
                fetchFiles(ip, connectionId).then((computer) =>
                  setComputer(computer)
                );
                setProcess(null);
              }}
              computer={computer}
              connectionId={connectionId}
              onCreation={(process) => setProcess(process)}
              onError={(error) => setError(error)}
            />
          </div>
        </>
      )}
    </>
  );
}

Files.propTypes = {};

export default Files;

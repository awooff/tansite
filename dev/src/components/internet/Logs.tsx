import React, { useContext, useState } from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import { Computer } from "../../lib/types/computer.type";
import { Process } from "../../lib/types/process.type";
import { createProcess } from "../../lib/process";
import SessionContext from "../../contexts/session.context";

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
          <div
            className="d-grid bg-black border border-info p-3"
            style={{
              minHeight: "68vh",
              overflowY: "auto",
              maxHeight: "74vh",
              height: "100%",
            }}
          >
            <Row></Row>
          </div>
        </>
      )}
    </>
  );
}

Logs.propTypes = {};

export default Logs;

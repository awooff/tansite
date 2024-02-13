import React, { useContext } from "react";
import { Computer } from "../../lib/types/computer.type";
import { Process } from "../../lib/types/process.type";
import { Alert, Col, Row, Button } from "react-bootstrap";
import SessionContext from "../../contexts/session.context";

function BrowserLayout({
  error,
  process,
  setTab,
  computer,
  connectionId,
  variant = "secondary",
  children,
}: {
  error?: Error | null;
  process?: Process | null;
  computer: Computer | null;
  setTab: (tab: string) => void;
  connectionId: string;
  variant?:
    | "success"
    | "secondary"
    | "dark"
    | "light"
    | "info"
    | "primary"
    | "danger"
    | "warning";
  children?: React.ReactNode[] | React.ReactNode;
}) {
  const session = useContext(SessionContext);
  return (
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
                  (new Date(process.completion).getTime() - Date.now()) / 1000
                )}{" "}
                seconds
              </p>
            </Col>
          </Row>
        </Alert>
      ) : (
        <></>
      )}
      {computer && computer.type === "search_engine" ? (
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
        onClick={() => {
          setTab("files");
        }}
        disabled={
          session.data.logins?.[connectionId]?.find(
            (login) => login.id === computer?.id
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
            (login) => login.id === computer?.id
          ) === undefined
        }
        onClick={() => {
          setTab("logs");
        }}
      >
        Logs
      </Button>
      <div
        className={`d-grid bg-black border border-${variant} p-3 browser-frame`}
      >
        {children}
      </div>
    </>
  );
}

export default BrowserLayout;

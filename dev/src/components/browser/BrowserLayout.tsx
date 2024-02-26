import React, { useContext, useEffect } from "react";
import { Computer } from "../../lib/types/computer.type";
import { Process } from "../../lib/types/process.type";
import { Alert, Button } from "react-bootstrap";
import SessionContext from "../../contexts/session.context";
import ProcessComponent from "../ProcessComponent";

function BrowserLayout({
  error,
  process,
  setTab,
  access,
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
  access?: object | null;
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
      {process ? <ProcessComponent process={process} /> : <></>}

      <div className="bg-light">
        {computer && computer.type === "search_engine" ? (
          <Button
            className="rounded-0 bg-transparent btn-outline-success"
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
            className="rounded-0 bg-transparent btn-outline-success"
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
          className="rounded-0 bg-transparent btn-outline-danger"
          size="sm"
          hidden={access !== null}
          variant="danger"
          onClick={() => {
            setTab("hack");
          }}
        >
          Hack
        </Button>
        <Button
          className="rounded-0 bg-transparent btn-outline-primary"
          size="sm"
          hidden={access === null}
          variant="primary"
          onClick={() => {
            setTab("connection");
          }}
        >
          Connection
        </Button>
        <Button
          className="rounded-0 bg-transparent btn-outline-warning"
          variant="warning"
          size="sm"
          onClick={() => {
            setTab("files");
          }}
          hidden={
            session.data.logins?.[connectionId]?.find(
              (login) => login.id === computer?.id
            ) === undefined
          }
        >
          Files
        </Button>
        <Button
          className="rounded-0 bg-transparent btn-outline-info"
          variant="info"
          size="sm"
          hidden={
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
      </div>

      <div
        style={{
          overflowX: "hidden",
        }}
        className={`d-grid bg-black border border-${variant} p-3 browser-frame`}
      >
        {children}
      </div>
    </>
  );
}

export default BrowserLayout;

import React, { useContext, useEffect, useRef, useState } from "react";
import { Computer } from "../../lib/types/computer.type";
import { Process } from "../../lib/types/process.type";
import { Alert, Button } from "react-bootstrap";
import SessionContext from "../../contexts/session.context";
import BrowserProcessToast from "./BrowserProcessToast";
import WebEvents from "../../lib/events";

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
  const eventRef = useRef<(modal: string, data: object) => void>();
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [currentModalData, setCurrentModalData] = useState<object | null>({});

  useEffect(() => {
    if (eventRef.current) WebEvents.off("showModal", eventRef.current);

    eventRef.current = (modal, data) => {
      setCurrentModal(currentModal);
      setCurrentModalData(data);
    };
    WebEvents.on("showModal", eventRef.current);

    return () => {
      if (eventRef.current) WebEvents.off("showModal", eventRef.current);
    };
  }, []);

  return (
    <>
      {error ? (
        <div
          style={{
            position: "absolute",
            marginTop: 48,
            width: 425,
            zIndex: 3,
          }}
        >
          <Alert
            variant="danger"
            className="ms-3 border border-danger"
            style={{
              backgroundColor: "rgba(0,0,0,0.8)",
            }}
          >
            <p className="display-5 border-bottom text-danger border-danger">
              Error!
            </p>
            {error.message || error.toString()}
          </Alert>
        </div>
      ) : (
        <></>
      )}
      {process ? <BrowserProcessToast process={process} /> : <></>}

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

import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import { Computer } from "../../../lib/types/computer.type";
import { Process } from "../../../lib/types/process.type";
import SessionContext from "../../../contexts/session.context";
import FileTreeComponent from "../../FileTreeComponent";
import { useProcessStore } from "../../../lib/stores/process.store";
import BrowserLayout from "../BrowserLayout";

function Files({
  connectionId,
  ip,
  markdown,
  valid,
  computer,
  access,
  setTab,
}: {
  connectionId: string;
  ip: string;
  markdown: string;
  valid: boolean;
  computer: Computer;
  access: object | null;
  setTab: (tab: string) => void;
}) {
  const session = useContext(SessionContext);
  const [process, setProcess] = useState<Process | null>(null);
  const processStore = useProcessStore();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!computer || ip || connectionId || !session.loaded) return;
    if (
      !session.data.logins[connectionId]?.find(
        (that) => that.ip === ip || that.id === computer.id
      )
    )
      setTab("homepage");
  }, [session, connectionId, ip, computer]);

  return (
    <BrowserLayout
      setTab={setTab}
      computer={computer}
      connectionId={connectionId}
      error={error}
      variant="warning"
      access={access}
      process={process}
    >
      <FileTreeComponent
        onCreation={(process) => {
          setProcess(process);
          processStore.addProcess(process);
        }}
        ip={computer.ip}
        onCompletion={(process) => {
          processStore.removeProcess(process);
          setProcess(null);
        }}
        connectionId={connectionId}
        onError={(error) => setError(error)}
      />
    </BrowserLayout>
  );
}

export default Files;

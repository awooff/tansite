import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import { Computer } from "../../../lib/types/computer.type";
import { Process } from "../../../lib/types/process.type";
import SessionContext from "../../../contexts/session.context";
import LogComponent from "../../LogComponent";
import BrowserLayout from "../BrowserLayout";

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
  computer: Computer;
  markdown: string;
  valid: boolean;
  access: object | null;
  setTab: (tab: string) => void;
}) {
  const session = useContext(SessionContext);
  const [process, setProcess] = useState<Process | null>(null);
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
      variant="info"
      computer={computer}
      connectionId={connectionId}
      error={error}
      access={access}
      process={process}
    >
      <Row>
        <Col>
          <LogComponent ip={computer.ip} connectionId={connectionId} />
        </Col>
      </Row>
    </BrowserLayout>
  );
}

Logs.propTypes = {};

export default Logs;

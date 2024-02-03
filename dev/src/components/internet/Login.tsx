import React from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import { Computer } from "../../lib/types/computer.type";

function Login({
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
          <Button className="rounded-0" size="sm" variant="primary">
            Login
          </Button>
          <Button
            className="rounded-0"
            variant="warning"
            size="sm"
            disabled
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
            disabled
            onClick={() => {
              setTab("logs");
            }}
          >
            Logs
          </Button>
          <div
            className="d-grid bg-black border border-primary p-3"
            style={{
              minHeight: "68vh",
              overflowY: "auto",
              maxHeight: "74vh",
              height: "100%",
            }}
          >
            <Row>
              <Col>
                <Card
                  body
                  className={"bg-transparent rounded-0 border-success"}
                  style={{
                    height: "100%",
                  }}
                >
                  <div className="d-grid gap-2">
                    <Card
                      body
                      className="mb-3 bg-transparent border-secondary rounded-0 text-white text-center"
                    >
                      $ connect {computer.ip}
                    </Card>
                    <Button variant="success">Connect</Button>
                  </div>
                </Card>
              </Col>
              <Col>
                <Card
                  body
                  className={"bg-transparent rounded-0 border-danger"}
                  style={{
                    height: "100%",
                  }}
                >
                  <div className="d-grid gap-2">
                    <Card
                      body
                      className="mb-3 bg-transparent border-secondary rounded-0 text-white text-center"
                    >
                      $ disconnect {computer.ip}
                    </Card>
                    <Button variant="danger">Disconnect</Button>
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

Login.propTypes = {};

export default Login;

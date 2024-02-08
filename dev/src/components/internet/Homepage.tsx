import React, { useContext } from "react";
import { Alert, Button, Card, Col, Row } from "react-bootstrap";
import { Computer } from "../../lib/types/computer.type";
import SessionContext from "../../contexts/session.context";

function Homepage({
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
          <p>Please wait for the index.html to be downloaded...</p>
        </Alert>
      ) : (
        <>
          <Button className="rounded-0" variant="success" size="sm">
            Homepage
          </Button>
          {!access ? (
            <Button
              className="rounded-0"
              variant="danger"
              size="sm"
              onClick={() => {
                setTab("hack");
              }}
            >
              Hack
            </Button>
          ) : (
            <>
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
                onClick={() => {
                  setTab("logs");
                }}
              >
                Logs
              </Button>
            </>
          )}
          <div className="d-grid bg-black border border-success p-3 browser-frame">
            {!markdown || markdown.length === 0 ? (
              <>
                <p>Missing document...</p>
              </>
            ) : (
              <iframe
                sandbox="allow-scripts"
                srcDoc={`
                        <script>
                          window.computer = ${JSON.stringify(computer)}
                        </script>
                        ${markdown}
                        <script>                   
                            let elements = document.getElementsByTagName('span');
                            
                            for(let i = 0; i < elements.length; i++){
                              let elm = elements[i];   
                              if(elm.getAttribute('data-computer'))
                                elm.innerHTML = window.computer[elm.getAttribute('data-computer')]
                            }
                        </script>
                        `}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "white",
                  overflowX: "hidden",
                  overflowY: "scroll",
                }}
              ></iframe>
            )}
          </div>
        </>
      )}
    </>
  );
}

Homepage.propTypes = {};

export default Homepage;

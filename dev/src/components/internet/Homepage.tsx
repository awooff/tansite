import React from "react";
import { Alert, Button, Card } from "react-bootstrap";
import { Computer } from "../../lib/types/computer.type";

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
                variant="success"
                onClick={() => {
                  setTab("login");
                }}
              >
                Login
              </Button>
              <Button
                className="rounded-0"
                variant="success"
                size="sm"
                disabled
                onClick={() => {
                  setTab("files");
                }}
              >
                Files
              </Button>
            </>
          )}
          <div
            className="d-grid bg-black border border-success p-3"
            style={{
              minHeight: "68vh",
              overflowY: "auto",
              maxHeight: "74vh",
              height: "100%",
            }}
          >
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

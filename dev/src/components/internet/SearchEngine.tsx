import { useCallback, useContext, useRef, useState } from "react";
import { Computer } from "../../lib/types/computer.type";
import {
  Alert,
  Button,
  Card,
  Form,
  InputGroup,
  Row,
  Container,
  Col,
  Stack,
} from "react-bootstrap";
import { DNS } from "../../lib/types/dns.type";
import { postRequestHandler } from "../../lib/submit";
import toast from "react-hot-toast";
import SessionContext from "../../contexts/session.context";

function SearchEngine({
  connectionId,
  ip,
  computer,
  markdown,
  valid,
  access,
  setCurrentIp,
  setTab,
}: {
  connectionId: string;
  ip: string;
  computer: Computer | null;
  markdown: string;
  valid: boolean;
  access: object | null;
  setCurrentIp: (tab: string) => void;
  setTab: (tab: string) => void;
}) {
  const session = useContext(SessionContext);
  const searchQuery = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<DNS[]>([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const fetchResults = useCallback((query: string, page = 0) => {
    return postRequestHandler<{
      results: DNS[];
      count: number;
      pages: number;
    }>("/internet/search", {
      domain: query,
      page,
    }).then((result) => {
      setResults(result.data.results);
      setCount(result.data.count);
    });
  }, []);

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
          <p>Please wait for the search engine to respond...</p>
        </Alert>
      ) : (
        <>
          <Button className="rounded-0" variant="success" size="sm">
            Search
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
            {results.length === 0 ? (
              <Card body className="bg-white">
                <Row>
                  <Col>
                    <div className="d-grid">
                      <iframe
                        srcDoc={markdown}
                        className="mx-auto"
                        seamless
                        width="720px"
                        scrolling="no"
                        height="400px"
                      ></iframe>
                    </div>
                    <Row className="mt-4 justify-content-center">
                      <Col lg={4}>
                        <Alert variant="primary" className="text-center">
                          Search for things on the internet!
                        </Alert>
                        <InputGroup className="border">
                          <InputGroup.Text>🔍</InputGroup.Text>
                          <Form.Control
                            type="text"
                            className="rounded-0"
                            placeholder={"Enter anything..."}
                            ref={searchQuery}
                            name="addressbar"
                            onKeyUp={(e) => {
                              if (
                                e.key === "Enter" &&
                                searchQuery.current?.value
                              ) {
                                let promise = fetchResults(
                                  searchQuery.current.value,
                                  page
                                );
                                toast.promise(promise, {
                                  loading: "Fetching search results",
                                  error: "Failed to fetch search results",
                                  success: "Success!",
                                });
                              }
                            }}
                            aria-label="Input group example"
                            aria-describedby="btnGroupAddon"
                          />
                          <Button
                            onClick={() => {
                              if (!searchQuery.current?.value) return;

                              let promise = fetchResults(
                                searchQuery.current?.value,
                                page
                              );
                              toast.promise(promise, {
                                loading: "Fetching search results",
                                error: "Failed to fetch search results",
                                success: "Success!",
                              });
                            }}
                            size="sm"
                            variant="success"
                          >
                            Search
                          </Button>
                        </InputGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            ) : (
              <Card body className="bg-white">
                <Container>
                  <Row>
                    <Col className="text-black">
                      <p className="display-4 mt-2">{computer.data.title}</p>
                    </Col>
                    <Col>
                      <Row className="mt-4 justify-content-center">
                        <Col>
                          <InputGroup className="border">
                            <InputGroup.Text>🔍</InputGroup.Text>
                            <Form.Control
                              type="text"
                              className="rounded-0"
                              placeholder={"Enter anything..."}
                              ref={searchQuery}
                              name="addressbar"
                              onKeyUp={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  searchQuery.current?.value
                                ) {
                                  let promise = fetchResults(
                                    searchQuery.current.value,
                                    page
                                  );
                                  toast.promise(promise, {
                                    loading: "Fetching search results",
                                    error: "Failed to fetch search results",
                                    success: "Success!",
                                  });
                                }
                              }}
                              aria-label="Input group example"
                              aria-describedby="btnGroupAddon"
                            />
                            <Button
                              onClick={() => {
                                if (!searchQuery.current?.value) return;

                                let promise = fetchResults(
                                  searchQuery.current?.value,
                                  page
                                );
                                toast.promise(promise, {
                                  loading: "Fetching search results",
                                  error: "Failed to fetch search results",
                                  success: "Success!",
                                });
                              }}
                              size="sm"
                              variant="success"
                            >
                              Search
                            </Button>
                          </InputGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Stack gap={1} className="pt-4 border-top ">
                    <p>
                      Displaying {results.length} results out of {count}
                    </p>
                    {results.map((result, index) => {
                      return (
                        <Row key={index}>
                          <Col>
                            <div
                              className={"d-grid p-2"}
                              style={{
                                backgroundColor:
                                  index % 2 === 0 ? "whitesmoke" : "",
                              }}
                            >
                              <a
                                className="display-5 text-primary border-bottom border-primarys"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setCurrentIp(result.website);
                                }}
                              >
                                {result.website}{" "}
                              </a>
                              <p className="mt-2">{result.description}</p>
                              <p>
                                {result.tags && result.tags.length !== 0
                                  ? result.tags
                                      .split(",")
                                      .map((tag) => (
                                        <span className="badge bg-secondary me-2">
                                          {tag}
                                        </span>
                                      ))
                                  : "no tags"}
                              </p>
                            </div>
                          </Col>
                        </Row>
                      );
                    })}
                    <p>
                      End of {results.length} results out of {count}
                    </p>
                  </Stack>
                </Container>
              </Card>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default SearchEngine;

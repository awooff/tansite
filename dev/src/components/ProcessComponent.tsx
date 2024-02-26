import { Alert, Row, Col, ProgressBar } from "react-bootstrap";
import { Process } from "../lib/types/process.type";
import { useEffect, useRef, useState } from "react";

function ProcessComponent({ process }: { process: Process | null }) {
  const [time, setTime] = useState(0);
  const interval = useRef<number>();

  useEffect(() => {
    interval.current = setInterval(() => {
      setTime(Date.now());
    }, 100);

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  if (
    !process ||
    Math.round((new Date(process.completion).getTime() - time) / 1000) < 0
  )
    return <></>;

  return (
    <Alert
      variant="primary"
      className="border-primary border ms-2"
      style={{
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.9)",
        pointerEvents: "none",
        touchAction: "none",
        zIndex: 2,
        marginTop: 38,
      }}
    >
      <Row className="pe-3">
        <Col className="display-3 mb-2" lg={4}>
          ⚙️
        </Col>
        <Col>
          <Row>
            <Col>
              <h5>Executing {process.type}</h5>
              <p
                style={{
                  fontSize: "12px",
                }}
              >
                Time remaining:{" "}
                {Math.round(
                  (new Date(process.completion).getTime() - time) / 1000
                )}{" "}
                seconds
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <ProgressBar
                variant={
                  time > new Date(process.completion).getTime()
                    ? "success"
                    : "danger"
                }
                label={
                  time > new Date(process.completion).getTime()
                    ? "COMPLETE"
                    : (
                        (new Date(process.completion).getTime() - time) /
                        1000
                      ).toFixed(2) + " seconds"
                }
                now={
                  ((time - new Date(process.started).getTime()) /
                    (new Date(process.completion).getTime() -
                      new Date(process.started).getTime())) *
                  100
                }
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Alert>
  );
}

export default ProcessComponent;

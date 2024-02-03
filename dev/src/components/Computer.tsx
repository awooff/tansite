import React, { ReactNode, useContext } from "react";
import { Col, Card, ListGroup, Row } from "react-bootstrap";
import { Computer } from "../lib/types/computer.type";
import { Hardware, HardwareType } from "../lib/types/hardware.type";
import GameContext, { GameType } from "../contexts/game.context";
import SessionContext, { SessionType } from "../contexts/session.context";
import { Link, useNavigate } from "react-router-dom";

export default function ComputerThumbnail({
  computer,
  connections,
  children,
  render,
  className,
}: {
  computer: Computer;
  connections?: Computer[];
  className?: string;
  render?: (
    game: GameType,
    session: SessionType,
    computer: Computer,
    connections?: Computer[]
  ) => ReactNode | ReactNode[];
  children?: ReactNode[];
}) {
  const game = useContext(GameContext);
  const session = useContext(SessionContext);
  const navigate = useNavigate();
  const connected =
    connections &&
    connections?.filter((that) => that.id === computer.id).length !== 0;
  const rendered = render ? (
    render(game, session, computer, connections)
  ) : (
    <></>
  );
  return (
    <Col>
      <Card
        body
        className={
          !className
            ? !connected
              ? "bg-transparent border border-success"
              : "bg-transparent border border-danger"
            : className
        }
      >
        <p>
          <span className="badge bg-secondary me-2">{computer.type}</span>
          {computer.data.title}
          {session.user.id === computer.userId ? (
            <>
              <span className="ms-2">✏️</span>
              {connected ? (
                <span
                  className="ms-2"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigate("/internet/browser", {
                      state: {
                        connectionId: computer.id,
                      },
                    });
                  }}
                >
                  🌎
                </span>
              ) : (
                <></>
              )}
            </>
          ) : (
            ""
          )}
          <span
            className="badge bg-secondary"
            style={{
              float: "right",
            }}
          >
            🛠️{" "}
            {Math.floor(
              computer.hardware.reduce((prev, cur) => {
                return {
                  ...prev,
                  strength: Math.round(cur.strength + prev.strength),
                };
              }).strength /
                computer.hardware.length /
                24
            )}
          </span>
        </p>
        <Row>
          <Col>
            <Card
              body
              className="bg-transparent border border-primary text-center mt-2 text-white"
            >
              <Link
                className="text-white"
                to={connected ? "/computers/files/" + computer.id : ""}
              >
                {computer.ip}
              </Link>
              <br />
              <hr />

              <span
                style={{
                  fontSize: 12,
                }}
              >
                <span
                  className={
                    !computer.process || computer.process.length === 0
                      ? "text-danger"
                      : "text-success"
                  }
                >
                  {computer.process ? computer.process.length : 0}
                </span>{" "}
                Active Processes
                <br />
              </span>

              <span
                style={{
                  fontSize: 10,
                }}
              >
                {connected ? (
                  <span className="text-success">CONNECTED</span>
                ) : (
                  <span className="text-danger">DISCONNECTED</span>
                )}
              </span>
            </Card>
          </Col>
        </Row>
        <ListGroup className="mb-2 mt-3">
          {(() => {
            const hardwares = {} as Record<HardwareType, Hardware>;
            const counts = {} as Record<HardwareType, number>;

            computer.hardware.forEach((hardware) => {
              counts[hardware.type] = counts[hardware.type] || 0;
              if (hardwares[hardware.type]) {
                hardwares[hardware.type].strength += hardware.strength;
              } else hardwares[hardware.type] = hardware;

              counts[hardware.type] += 1;
            });

            return Object.values(hardwares).map((hardware, index) => {
              return (
                <ListGroup.Item key={index}>
                  <span className="badge bg-secondary me-4">
                    {counts[hardware.type]} /{" "}
                    {computer.data?.hardwareLimits?.[hardware.type] || -1}
                  </span>
                  {hardware.type}{" "}
                  <span
                    className="badge bg-primary"
                    style={{
                      float: "right",
                    }}
                  >
                    {hardware.strength}
                  </span>
                </ListGroup.Item>
              );
            });
          })()}
        </ListGroup>
        {children}
        {rendered}
      </Card>
    </Col>
  );
}

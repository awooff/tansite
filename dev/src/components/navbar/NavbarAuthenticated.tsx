import React, { useContext } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import GameContext from "../../contexts/game.context";

export default function NavbarAuthenticated() {
  const game = useContext(GameContext);

  return (
    <>
      <Nav className="me-auto">
        <NavDropdown title="🖥️">
          <NavDropdown.Item href="#navigate:/computers">
            Computers{" "}
            <span
              className="badge bg-danger ms-2"
              style={{
                float: "right",
              }}
            >
              {game?.computers?.length || 0}
            </span>
          </NavDropdown.Item>
          <NavDropdown.Item href="#navigate:/computers">
            Processes
            <span
              className="badge bg-danger ms-2"
              style={{
                float: "right",
              }}
            >
              {(() => {
                let count = 0;
                game.computers.forEach(
                  (val) => (count = count + val.process.length)
                );
                return count;
              })()}
            </span>
          </NavDropdown.Item>
          <NavDropdown.Item href="#navigate:/computers/network">
            Network{" "}
            <span
              className="badge bg-danger ms-2"
              style={{
                float: "right",
              }}
            >
              {game?.connections?.length || 0}
            </span>
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#navigate:/computers/purchase">
            Purchase New Computer
          </NavDropdown.Item>
        </NavDropdown>
        <NavDropdown title="🌐">
          <NavDropdown.Item href="#navigate:/internet/browser">
            Browser{" "}
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#navigate:/internet/provider">
            Internet Service Provider
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Nav className="ms-auto">
        <Nav.Link className="text-white">
          <span className="badge bg-secondary">0 NOTIFICATIONS</span>
        </Nav.Link>
        <Nav.Link className="text-white" href="#navigate:/computers/network">
          <span
            className={
              game?.connections && game?.connections?.length !== 0
                ? "badge bg-success"
                : "badge bg-secondary"
            }
          >
            {game?.connections?.length || 0}/3 CONNECTIONS
          </span>
        </Nav.Link>
        <Nav.Link className="text-white">
          <span
            className="badge bg-success"
            style={{
              fontSize: "1.10rem",
            }}
          >
            $
            {game.bankAccounts.length !== 0
              ? game.bankAccounts.reduce((previousValue, currentValue) => {
                  return {
                    ...previousValue,
                    value: previousValue.value + currentValue.value,
                  };
                }).value
              : 0}
          </span>
        </Nav.Link>
      </Nav>
    </>
  );
}

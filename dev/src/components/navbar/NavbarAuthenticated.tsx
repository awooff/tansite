import React, { useContext } from "react";
import { Nav, NavDropdown } from "react-bootstrap";
import GameContext from "../../contexts/game.context";

export default function NavbarAuthenticated({
  setTab,
}: {
  setTab: (str: string) => void;
}) {
  const game = useContext(GameContext);

  return (
    <>
      <Nav className="me-auto">
        <Nav.Link
          onClick={() => {
            setTab("computers");
          }}
        >
          🖥️ COMPUTERS
        </Nav.Link>
        <Nav.Link
          onClick={() => {
            setTab("hacking");
          }}
        >
          😈 HACKING
        </Nav.Link>
        <Nav.Link
          onClick={() => {
            setTab("economy");
          }}
        >
          💲 ECONOMY
        </Nav.Link>
      </Nav>
      <Nav className="ms-auto">
        <Nav.Link className="text-white">
          <span className="badge bg-secondary rounded-0">0 📧</span>
        </Nav.Link>
        <Nav.Link className="text-white" href="#navigate:/computers/network">
          <span
            className={
              game?.connections && game?.connections?.length !== 0
                ? "badge bg-warning rounded-0"
                : "badge bg-secondary rounded-0"
            }
          >
            {game?.connections?.length || 0}/3 CONNECTIONS
          </span>
        </Nav.Link>
        <Nav.Link className="text-white">
          <span className="badge bg-success rounded-0">
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

import React, { useContext } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import SessionContext from "../../contexts/session.context";
import NavbarAuthenticated from "./NavbarAuthenticated";
import { createLinks } from "../../lib/links";
import { Link } from "react-router-dom";

function NavbarComponent() {
  const session = useContext(SessionContext);

  return (
    <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="fixed-top">
      <Container>
        <Navbar.Brand>
          <Link to={session.valid ? "/game" : "/"} className="text-success">
            ~/syscrack{" "}
            <span className="text-secondary">
              {session.valid ? session.user.name : "guest"}
            </span>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {session.valid ? (
            <NavbarAuthenticated />
          ) : (
            <>
              <Nav className="me-auto">
                {createLinks({
                  login: {
                    element: Nav.Link,
                    capitalize: true,
                    className: "text-white",
                  },
                  register: {
                    element: Nav.Link,
                    capitalize: true,
                    className: "text-white",
                  },
                })}
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;

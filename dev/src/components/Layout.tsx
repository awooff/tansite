import React, { ReactNode, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container, Stack, Row, Col } from "react-bootstrap";
import NavbarComponent from "./navbar/Navbar";
import { useNavigate } from "react-router-dom";

function Layout({
  children,
  fluid,
  gap,
}: {
  children: unknown;
  fluid?: boolean;
  gap?: number;
}) {
  const navigate = useNavigate();
  const [hasInit, setHasInit] = useState(false);

  //allows for hash code to redirect so we can do react router dom things with hrefs
  useEffect(() => {
    if (hasInit) return;

    window.addEventListener("hashchange", () => {
      if (location.hash.includes("navigate:"))
        navigate(location.hash.split("navigate:")[1]);
    });
    setHasInit(true);
  }, [hasInit, navigate]);

  return (
    <>
      <NavbarComponent />
      <Container fluid={fluid}>
        <Stack gap={gap !== undefined ? gap : 2} className="pt-2">
          {children as ReactNode[]}
        </Stack>
        <Row className="mt-2">
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.any,
};

export default Layout;

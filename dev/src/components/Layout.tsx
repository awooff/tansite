import React, { ReactNode } from "react";
import PropTypes from "prop-types";
import { Container, Stack, Row, Col } from "react-bootstrap";
import NavbarComponent from "./Navbar";

function Layout({
  children,
  fluid,
  gap,
}: {
  children: unknown;
  fluid?: boolean;
  gap?: number;
}) {
  return (
    <Container fluid={fluid}>
      <NavbarComponent />
      <Stack gap={gap ? gap : 2} className="pt-2">
        {children as ReactNode[]}
      </Stack>
      <Row className="mt-4 mb-5 pt-4 pb-4">
        <Col></Col>
      </Row>
    </Container>
  );
}

Layout.propTypes = {
  children: PropTypes.any,
};

export default Layout;

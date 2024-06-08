import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <Navbar bg="light" variant="light" expand="lg">
    <Container fluid>
      <Navbar.Brand href="/" style={{color:"#6210CC", fontWeight:"bold"}}>
        ChatIT 
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
    </Container>
  </Navbar>
  );
};

export default Header;

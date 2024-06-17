import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";
import { socket } from "../../Socket";
import { Button } from "react-bootstrap";
import "./Header.css";
const Header = ({ setAuth }) => {
  const navigate = useNavigate();
  const handleLogOut = () => {
    socket.disconnect();
    sessionStorage.clear();
    setAuth(false);
    navigate("/login");
  };
  return (
    <Navbar bg="light" variant="light" expand="lg">
      <Container fluid>
        <Navbar.Brand
          href="/"
          style={{
            color: "#6210CC",
            fontWeight: "bold",
            fontFamily: "monospace",
          }}
        >
          ChatIT
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as:{" "}
            <a className="text-capitalize text-decoration-none">
              {sessionStorage.getItem("name")}
            </a>
          </Navbar.Text>
          <Button
            className="logout"
            onClick={handleLogOut}
            variant="outline-primary"
            size="sm"
          >
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

import React, { useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import AuthContext from "../../context/UserauthContext";
import reactLogo from "../../assets/react.svg"; // Import logo đúng cách

const NavbarComponent = () => {
  const { accessToken, logout } = useContext(AuthContext);
  const location = useLocation().pathname;

  // Hàm trả về style cho Nav.Link dựa trên đường dẫn hiện tại
  const getNavStyle = (path) => ({
    color: location === path ? "white" : "lightgray",
    fontWeight: location === path ? "600" : "normal",
  });

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container style={{ margin: 0, maxWidth: "100%", height: "7dvh" }}>
        {/* Logo và tên ứng dụng */}
        <Navbar.Brand as={Link} to={accessToken ? "/home" : "/"}>
          <img
            alt="Logo"
            src={reactLogo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          {import.meta.env.VITE_APPLICATION_NAME}
        </Navbar.Brand>

        {/* Thanh điều hướng */}
        <Nav className="me-auto">
          {accessToken && (
            <>
              <Nav.Link as={Link} to="/home" style={getNavStyle("/home")}>
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/features" style={getNavStyle("/features")}>
                Features
              </Nav.Link>
              <Nav.Link as={Link} to="/history" style={getNavStyle("/history")}>
                History
              </Nav.Link>
            </>
          )}
        </Nav>

        <Navbar.Toggle />

        {/* Nút Dropdown bên phải */}
        <Navbar.Collapse className="justify-content-end">
          {accessToken ? (
            <DropdownButton as={ButtonGroup} variant="primary" title="Admin" style={{ width: "10rem", border: "1px solid" }}>
              <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
            </DropdownButton>
          ) : (
            <DropdownButton as={ButtonGroup} variant="primary" title="Get started" style={{ width: "10rem", border: "1px solid" }}>
              <Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
              <Dropdown.Item as={Link} to="/signup">Signup</Dropdown.Item>
            </DropdownButton>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

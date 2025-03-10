import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React from 'react';

function Header() {
  return (
    <Navbar expand="lg" bg="primary" variant="dark">
      <Container>

        <Navbar.Brand href="#home"><i class="fas fa-home"></i> Easy Way</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home"><i class="fa-solid fa-house"></i> Home</Nav.Link>
            <Nav.Link href="#profile"><i class="fa-solid fa-user"></i> Profile</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#filters/3.1">Filters</NavDropdown.Item>
              <NavDropdown.Item href="#location/3.2">Location</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>

        <Nav.Link href="#search"><i class="fas fa-search"></i> {" "} <input id="searchbar" onkeyup="search_animal()" type="text" name="search"></input></Nav.Link>

        <Nav.Link href="#signup_login" style={{ marginLeft: '20px' }}> <i class="fas fa-sign-in-alt"></i> Sign up </Nav.Link>

      </Container>
    </Navbar>
  );
}

export default Header;
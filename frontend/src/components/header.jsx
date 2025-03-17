import React from 'react';
import { Container, Nav, Navbar, NavDropdown, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
import '../index.css'
import { useNavigate } from 'react-router-dom';

function Header() {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login'); // Instantly redirect to LoginScreen
  };
  return (
    <Navbar expand="lg" className="bg-white shadow-sm fixed-top w-100">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          <i className="fas fa-home"></i> Easy Stay
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/"><i className="fa-solid fa-house"></i> Home</Nav.Link>
          </Nav>

          {/* Search Bar */}
        <Form className="d-flex mx-auto justify-content-center w-50">
          <Form.Control type="search" placeholder="Search destinations" className="me-2" />
          <Button variant="outline-primary"><i className="fas fa-search"></i></Button>
        </Form>

          {/* User Info / Login */}
          {userInfo ? (
            <Nav>
              <NavDropdown title={userInfo.name} id="username">
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link as={Link} to="/login"><i className="fas fa-user"></i> Login</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
import RoomSearchBar from "./RoomSearchBar";

function Header() {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="bg-white shadow-sm fixed-top w-100">
      <Container fluid className="px-4">
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          <i className="fas fa-home"></i> Easy Stay
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <div className="mx-auto w-50">
            <RoomSearchBar />
          </div>

          <Nav className="ms-auto">
            {userInfo?.role === 'host' && (
              <Nav.Link as={Link} to="/create-listing" className="fw-semibold">
                <i className="fas fa-plus"></i> Create Listing
              </Nav.Link>
            )}

            {userInfo ? (
              <NavDropdown title={userInfo.name} id="username">
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">
                <i className="fas fa-user"></i> Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;

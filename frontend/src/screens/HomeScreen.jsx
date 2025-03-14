import React, { useEffect } from 'react';
import { Container, Navbar, Nav, Card, Button, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from '../components/rating';
import { useDispatch, useSelector } from 'react-redux';
import { listRooms } from '../actions/roomActions';
import Loader from '../components/Loader'; 
import Message from '../components/Message'; 

function HomeScreen() {
  const dispatch = useDispatch();
  const roomList = useSelector(state => state.roomsList); 
  const { loading, error, rooms } = roomList;

  useEffect(() => {
    dispatch(listRooms());
  }, [dispatch]);

  return (
    <>
      {/* Navbar */}
      <Navbar expand="lg" className="bg-white shadow-sm fixed-top w-100">
        <Container fluid className="px-4">
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
            <i className="fas fa-home"></i> Easy Stay
          </Navbar.Brand>
          <Form className="d-flex w-50">
            <Form.Control type="search" placeholder="Search destinations" className="me-2" />
            <Button variant="outline-primary"><i className="fas fa-search"></i></Button>
          </Form>
          <Nav>
            <Nav.Link as={Link} to="/login"><i className="fas fa-user"></i> Login</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="d-flex flex-column align-items-center justify-content-center text-center py-3" 
        style={{ height: '15vh', marginTop: '80px', width: '100%' }}>
        <h1 className="fw-bold">Find Your Perfect Stay</h1>
        <p className="text-muted fs-5">Discover unique stays and experiences around the world.</p>
      </div>

      {/* Latest Rooms Section */}
      <Container fluid className="px-4">
        <h1>Latest Rooms</h1>  {/* ✅ Moved inside return */}
        
        {loading ? (
          <Loader />  
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Row className="g-4">
            {rooms.map((room) => (
              <Col key={room._id} xs={12} sm={6} md={4} lg={3} xl={2}>
                <Card className="border-0 shadow-sm rounded-4 h-100">
                  <Link to={`/rooms/${room._id}`}>
                    <Card.Img 
                      variant="top" 
                      src={room.image} 
                      className="rounded-4"
                      style={{ width: '100%', height: '250px', objectFit: 'cover' }} 
                    />
                  </Link>
                  <Card.Body className="text-start">
                    <Card.Title className="text-truncate fs-6">{room.name}</Card.Title>
                    <p className="text-muted mb-1" style={{ fontSize: '14px' }}>
                      {room.location} • {room.distance} km away
                    </p>
                    <Rating value={room.rating} text={`${room.numReviews} reviews`} color={'#f8e825'} />
                    <Card.Text className="fs-6">
                      <strong>₱{room.price ? room.price : 'N/A'}</strong> / night
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}

export default HomeScreen;

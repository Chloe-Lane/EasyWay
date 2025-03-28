import React, { useEffect } from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listRooms } from '../actions/roomActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/rating';
import Header from '../components/header';

function HomeScreen() {
  const dispatch = useDispatch();
  const roomList = useSelector((state) => state.roomsList);
  const { loading, error, rooms } = roomList;

  useEffect(() => {
    dispatch(listRooms());
    console.log('Rooms:', rooms);
  }, [dispatch]);

  return (
    <>
      <Header />  {/* Now using the Header component */}

      {/* Hero Section */}
      <div className="d-flex flex-column align-items-center justify-content-center text-center py-3" 
        style={{ height: '15vh', marginTop: '80px', width: '100%' }}>
        <h1 className="fw-bold">Find Your Perfect Stay</h1>
        <p className="text-muted fs-5">Discover unique stays and experiences around the world.</p>
      </div>

      {/* Latest Rooms Section */}
      <Container fluid className="w-100 m-0 p-0">
        <h3 className="px-3">Latest Rooms</h3>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Row className="g-3 justify-content-center">
            {rooms.map((room) => (
              <Col key={room._id} lg={2} md={4} sm={6} className="d-flex">
                <Card className="border-0 shadow-sm rounded-4 w-100">
                  <Link to={`/rooms/${room._id}`}>
                    <Card.Img
                      variant="top"
                      src={room.image}
                      className="rounded-4 w-100"
                      style={{ height: '300px', objectFit: 'cover' }}
                    />
                  </Link>
                  <Card.Body className="text-start">
                    <Card.Title className="text-truncate fs-6">{room.name}</Card.Title>
                    <p className="text-muted mb-1" style={{ fontSize: '14px' }}>
                      <b>{room.location} • {room.distance}  </b> km away
                    </p>
                    <Rating
                      value={room.rating}
                      text={<span className="d-block" style={{ fontSize: '13px', marginTop: '2px', marginBottom: '10px'}}>{room.numReviews} reviews</span>}
                      color={'#f8e825'}
                    />
                    <Card.Text className="fs-6">
                      <strong><b>₱{room.price ? room.price : 'N/A'}</b></strong> / night
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

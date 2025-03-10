import React from 'react';
import { Card } from 'react-bootstrap';
import Rating from '../components/rating';  // Updated path
import { Link } from 'react-router-dom';

function Rooms({ rooms }) {
  return (
    <div className="d-flex justify-content-center my-3">
      <Card
        className="mx-3 my-3 p-4 rounded shadow"
        style={{
          width: '25rem',
          height: '45rem',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden', // Prevent content from overflowing
        }}
      >
        <Link to={`/rooms/${rooms._id}`}>
          <Card.Img
            src={rooms.image}
            style={{
              height: '15rem',
              objectFit: 'cover', // Ensure image fits within its container
            }}
          />
        </Link>

        <Card.Body className="d-flex flex-column">
          <Link to={`/rooms/${rooms._id}`} className="text-decoration-none">
            <Card.Title className="mb-2">
              <strong className="text-dark">{rooms.name}</strong>
            </Card.Title>
          </Link>

          <Card.Text className="text-dark" style={{ flexGrow: 1, overflowY: 'auto' }}>

          <Card.Text as="div">
            <div className="my-3">
              <Rating value={rooms.rating} text={`${rooms.numReviews} reviews `} color={'#f8e825'} />
            </div>
          </Card.Text>
          
            <p>
              Price: <strong>₱{rooms.price}</strong>
            </p>
            <p>
              <i className="fas fa-location-arrow"></i> Location:{' '}
              <strong>{rooms.location}</strong>
            </p>
            <p>
              Description: <strong>{rooms.description}</strong>
            </p>
          </Card.Text>

        </Card.Body>
      </Card>
    </div>
  );
}

export default Rooms;

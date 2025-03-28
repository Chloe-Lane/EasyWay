import React from 'react';
import { Card } from 'react-bootstrap';
import Rating from '../components/rating';  // Updated path
import { Link } from 'react-router-dom';

function Rooms({ room }) {  // Changed 'rooms' to 'room' to match the data structure
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
          <Link to={`/rooms/${room._id}`}>
            <Card.Img
              src={room.image}
              style={{
                height: '15rem',
                objectFit: 'cover', // Ensure image fits within its container
              }}
            />
          </Link>
  
          <Card.Body className="d-flex flex-column">
            <Link to={`/rooms/${room._id}`} className="text-decoration-none">
              <Card.Title className="mb-2">
                <strong className="text-dark">{room.name}</strong>
              </Card.Title>
            </Link>
  
            <Card.Text className="text-dark" style={{ flexGrow: 1, overflowY: 'auto' }}>
  
            <Card.Text as="div">
              <div className="my-3">
                <Rating value={room.rating} text={`${room.numReviews} reviews `} color={'#f8e825'} />
              </div>
            </Card.Text>
            
              <p>
                Price: <strong>₱{room.price}</strong>
              </p>
              <p>
                <i className="fas fa-location-arrow"></i> Location:{' '}
                <strong>{room.location}</strong>
              </p>
              <p>
                Description: <strong>{room.description}</strong>
              </p>
            </Card.Text>
  
          </Card.Body>
        </Card>
      </div>
    );
  }
  

export default Rooms;
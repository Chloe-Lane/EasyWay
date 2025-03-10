import React, { useEffect } from 'react';
import { Row, Col, Image, ListGroup } from 'react-bootstrap';
import Rating from '../components/rating';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listRoomDetails } from '../actions/roomActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

function RoomScreen() {
    const { id } = useParams();
    const dispatch = useDispatch();
    
    const roomDetails = useSelector(state => state.roomDetails);
    const { room = {}, loading, error } = roomDetails; 

    useEffect(() => {
        console.log("🔍 Fetching room details for ID:", id);
        dispatch(listRoomDetails(id));
    }, [dispatch, id]);
    
    return (
        <>
            <Link to="/" className="btn btn-light my-3">Return</Link>

            {loading ? (
                <Loader /> // ✅ Matches HomeScreen
            ) : error ? (
                <Message variant="danger">{error}</Message> // ✅ Matches HomeScreen
            ) : (
                <Row>
                    <Col md={6}>
                        {room.image ? (
                            <Image src={room.image} alt={room.name} fluid />
                        ) : (
                            <Message variant="warning">No image available</Message>
                        )}
                    </Col>
                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>{room.name || 'No Name Available'}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating value={room.rating || 0} text={`${room.numReviews || 0} reviews`} color={'#f8e825'} />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Price: <strong>${room.price || 'N/A'}</strong>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Description: {room.description || 'No description available'}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            )}
        </>
    );
}

export default RoomScreen;

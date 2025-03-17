import React, { useEffect, useState } from 'react';
import { Row, Col, Image, ListGroup, Button } from 'react-bootstrap';
import Rating from '../components/rating';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listRoomDetails } from '../actions/roomActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function RoomScreen() {
    const { id } = useParams();
    const dispatch = useDispatch();
    
    const roomDetails = useSelector(state => state.roomDetails);
    const { room = {}, loading, error } = roomDetails; 

    const [date, setDate] = useState(new Date());
    const [savedDate, setSavedDate] = useState(null);

    useEffect(() => {
        console.log("🔍 Fetching room details for ID:", id);
        dispatch(listRoomDetails(id));
    }, [dispatch, id]);

    const handleSaveDate = () => {
        setSavedDate(date);
    };

    const handleClearDate = () => {
        setSavedDate(null);
        setDate(new Date());
    };

    return (
        <>
            <Link to="/" className="btn btn-light my-3">Return</Link>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <>
                    {/* ROOM NAME */}
                    <Row className="justify-content-center">
                        <Col md={8} className="text-center">
                            <h2 className="text-primary" style={{ fontSize: '26px' }}>
                                {room.name || 'No Name Available'}
                            </h2>
                        </Col>
                    </Row>

                    {/* IMAGE */}
                    <Row className="justify-content-center mt-2">
                        <Col md={8} className="text-center">
                            {room.image ? (
                                <Image 
                                    src={room.image} 
                                    alt={room.name} 
                                    fluid 
                                    style={{ maxWidth: '700px', borderRadius: '10px' }} 
                                />
                            ) : (
                                <Message variant="warning">No image available</Message>
                            )}
                        </Col>
                    </Row>

                    {/* ROOM DETAILS */}
                    <Row className="justify-content-center mt-4">
                        <Col md={8}>
                            <ListGroup variant="flush" style={{ fontSize: '18px' }}>
                                <ListGroup.Item>
                                    <strong>Reviews:</strong> 
                                    <Rating value={room.rating || 0} text={`${room.numReviews || 0} reviews`} color={'#f8e825'} />
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Price:</strong> <span>${room.price || 'N/A'}</span>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Description:</strong> <span>{room.description || 'No description available'}</span>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>

                    {/* CALENDAR & BOOKING DATE */}
                    <Row className="justify-content-center mt-4">
                        <Col md={6} className="text-center">
                            <h4 style={{ fontSize: '20px', marginBottom: '10px' }}>
                                SELECT BOOKING DATE:
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Calendar 
                                    onChange={setDate} 
                                    value={date} 
                                    tileContent={({ date }) =>
                                        savedDate && date.toDateString() === savedDate.toDateString() ? (
                                            <span style={{ fontWeight: 'bold' }}>{date.getDate()}</span>
                                        ) : null
                                    }
                                    tileClassName={({ date }) =>
                                        savedDate && date.toDateString() === savedDate.toDateString() ? 'saved-date' : ''
                                    }
                                    tileDisabled={() => false}
                                    navigationLabel={({ date }) => `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`}
                                    prevLabel="«"
                                    nextLabel="»"
                                />
                                <p style={{ fontSize: '18px', marginTop: '10px' }}>
                                    Selected Date: <strong>{date.toDateString()}</strong>
                                </p>

                                {/* SAVE & CLEAR BUTTONS */}
                                <div className="mt-3">
                                    <Button variant="success" onClick={handleSaveDate} className="mx-2">Save Date</Button>
                                    <Button variant="danger" onClick={handleClearDate} className="mx-2">Clear Date</Button>
                                </div>

                                {/* DISPLAY SAVED DATE */}
                                {savedDate && (
                                    <p style={{ fontSize: '18px', marginTop: '10px', color: 'green' }}>
                                        <strong>Saved Date:</strong> {savedDate.toDateString()}
                                    </p>
                                )}
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
}

export default RoomScreen;

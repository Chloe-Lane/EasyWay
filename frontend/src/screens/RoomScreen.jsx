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
import '../index.css'; // Import the CSS file
import Map from "../components/Map"; // Import the Map component
import { setMapLocation } from '../actions/mapActions';

function RoomScreen() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const roomDetails = useSelector(state => state.roomDetails);
    const { room = {}, loading, error } = roomDetails;

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [savedDate, setSavedDate] = useState(null);

    useEffect(() => {
        dispatch(listRoomDetails(id));
    }, [dispatch, id]);
    
    useEffect(() => {
        if (room && room.latitude && room.longitude) {
            dispatch(setMapLocation(room.latitude, room.longitude));
        }
    }, [dispatch, room]);
    
    const handleDateClick = (clickedDate) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(clickedDate);
            setEndDate(null);
        } else if (clickedDate >= startDate) {
            setEndDate(clickedDate);
        } else {
            setStartDate(clickedDate);
            setEndDate(null);
        }
    };

    const isWithinRange = (date) => {
        if (startDate && endDate) {
            return date >= startDate && date <= endDate;
        }
        return false;
    };

    const handleSaveDate = () => {
        setSavedDate({ startDate, endDate });
    };

    const handleClearDate = () => {
        setStartDate(null);
        setEndDate(null);
        setSavedDate(null);
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
                    <Row className="justify-content-center">
                        <Col md={8} className="text-center">
                            <h2 className="room-title">
                                {room.name || 'No Name Available'}
                            </h2>
                        </Col>
                    </Row>

                    <Row className="justify-content-center mt-2">
                        <Col md={8} className="text-center">
                            {room.image ? (
                                <Image
                                    src={room.image}
                                    alt={room.name}
                                    fluid
                                    className="room-image"
                                    style={{ width: '600px', height: '500px', objectFit: 'cover' }}
                                />
                            ) : (
                                <Message variant="warning">No image available</Message>
                            )}
                        </Col>
                    </Row>

                    <Row className="justify-content-center mt-4">
                        <Col md={8}>
                            <ListGroup variant="flush" className="room-details">
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

                                <Row>
                                    <Col md={6}>
                                        <ListGroup.Item>
                                            <strong>Amenities:</strong>
                                            {room.amenities && room.amenities.length > 0 ? (
                                                <ul>
                                                    {room.amenities.map((amenity, index) => (
                                                        <li key={index}>{amenity.name}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span> No amenities available</span>
                                            )}
                                        </ListGroup.Item>
                                    </Col>

                                    {/* New Host Rules and Policies Section */}
                                    <Col md={6}>
                                        <ListGroup.Item>
                                            <strong>Host Rules & Policies:</strong>
                                            {room.policies ? (
                                                <ul>
                                                    {room.policies.map((policy, index) => (
                                                        <li key={index}>{policy.name}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span>No specific rules available.</span>
                                            )}
                                        </ListGroup.Item>
                                    </Col>
                                </Row>

                            </ListGroup>
                        </Col>
                    </Row>

                    <Row className="justify-content-center mt-4">
                        <Col md={8}>
                            <Map latitude={room.latitude || 51.505} longitude={room.longitude || -0.09} />
                        </Col>
                    </Row>

                    <Row className="justify-content-center mt-4">
                        <Col md={8} className="calendar-container">
                            <div className="calendar-wrapper">
                                <Calendar
                                    className="large-calendar"
                                    onClickDay={handleDateClick}
                                    tileClassName={({ date, view }) => {
                                        if (view === 'month') {
                                            if (
                                                (startDate && date.toDateString() === startDate.toDateString()) ||
                                                (endDate && date.toDateString() === endDate.toDateString())
                                            ) {
                                                return 'selected-start-date';
                                            }
                                            if (isWithinRange(date)) {
                                                return 'selected-range';
                                            }
                                        }
                                        return null;
                                    }}
                                />
                            </div>
                            <div className="date-selection">
                                <p><strong>Check-in Date:</strong> {startDate ? startDate.toDateString() : 'None'}</p>
                                <p><strong>Checkout Date:</strong> {endDate ? endDate.toDateString() : 'None'}</p>
                                <div className="button-group">
                                    <Button variant="success" onClick={handleSaveDate} className="small-button">
                                        SAVE DATE
                                    </Button>
                                    <Button variant="danger" onClick={handleClearDate} className="small-button">
                                        CLEAR DATE
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
}

export default RoomScreen;

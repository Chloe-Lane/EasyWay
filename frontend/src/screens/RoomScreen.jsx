import React, { useEffect, useState } from 'react';
import { Row, Col, Image, ListGroup, Button, Card, Container } from 'react-bootstrap';
import Rating from '../components/rating';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { listRoomDetails } from '../actions/roomActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../index.css';
import Map from "../components/Map";
import { setMapLocation } from '../actions/mapActions';
import { getUserProfile } from '../actions/userActions';
import { saveBookingDates } from "../actions/bookingActions"; // Create an action for this


function RoomScreen() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const roomDetails = useSelector((state) => state.roomDetails);
    const { room = {}, loading, error } = roomDetails;

 
    const handleSaveDates = () => {
        if (startDate && endDate) {
            const savedDates = { startDate, endDate };
            localStorage.setItem("bookingDates", JSON.stringify(savedDates)); // Or use Redux
            dispatch(saveBookingDates(savedDates)); // If using Redux
        }
    };
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [savedDate, setSavedDate] = useState(null);
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const handleDateSelection = (clickedDate) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(clickedDate);
            setEndDate(null);
            
        } else if (clickedDate >= startDate) {
            setEndDate(clickedDate);

        }
    };

    
    useEffect(() => {
        if (!room || room._id !== id) {
            dispatch(listRoomDetails(id));
        }
    }, [dispatch, id], room); 

    // ✅ Prevent unnecessary re-fetching of user profile
    useEffect(() => {
        if (!userInfo) {
            dispatch(getUserProfile());

        }
        console.log("User Info:", userInfo);
        console.log("Room Host:", room.host);
    }, [dispatch, userInfo]);   
    
    
    useEffect(() => {
        if (room && room.latitude && room.longitude) {
            dispatch(setMapLocation(room.latitude, room.longitude));
        }
    }, [dispatch, room]);

    return (
        <Container className="py-4">
            <Link to="/" className="btn btn-outline-primary mb-3">← Back to Listings</Link>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : room && room._id ? (
                <>
                    <Row>
                        <Col md={6} className="text-center">
                            <Image 
                                src={room.image || "/images/default-placeholder.jpg"} 
                                alt={room.name || "Room Image"} 
                                fluid 
                                className="rounded shadow-lg"
                            />
                        </Col>
                        <Col md={6}>
                            <Card className="p-4 shadow-lg">
                                <Card.Body>
                                    <Card.Title className="fs-3 text-primary">{room.name || 'No Name Available'}</Card.Title>
                                    <Rating value={room.rating || 0} text={`${room.numReviews || 0} reviews`} />
                                    <h4 className="text-success">${room.price || 'N/A'} / night</h4>
                                    <Card.Text>{room.description || 'No description available'}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    
                    <Row className="mt-4">
                        <Col md={6}>
                            <Card className="p-3 shadow-lg">
                                <Card.Body>
                                    <Card.Title>Amenities</Card.Title>
                                    <ListGroup>
                                        {room.amenities?.length ? (
                                            room.amenities.map((amenity, index) => (
                                                <ListGroup.Item key={index}>{amenity.name}</ListGroup.Item>
                                            ))
                                        ) : (
                                            <ListGroup.Item>No amenities available</ListGroup.Item>
                                        )}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="p-3 shadow-lg">
                                <Card.Body>
                                    <Card.Title>Host Rules & Policies</Card.Title>
                                    <ListGroup>
                                        {room.policies?.length ? (
                                            room.policies.map((policy, index) => (
                                                <ListGroup.Item key={index}>{policy.name}</ListGroup.Item>
                                            ))
                                        ) : (
                                            <ListGroup.Item>No specific rules available.</ListGroup.Item>
                                        )}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    
                    <Row className="mt-4">
                        <Col md={12} className="text-center">
                            <Card className="p-3 shadow-lg">
                                <Map latitude={room.latitude || 51.505} longitude={room.longitude || -0.09} />
                            </Card>
                        </Col>
                    </Row>
                    
                    <Row className="mt-2 justify-content-center">
                        <Col md={6} className="d-flex justify-content-center">
                            <Card className="p-3 shadow-lg" style={{ maxWidth: '350px' }}>
                                <Calendar
                                    className="small-calendar"
                                    onClickDay={(clickedDate) => {
                                        if (!startDate || (startDate && endDate)) {
                                            setStartDate(clickedDate);
                                            setEndDate(null);
                                        } else if (clickedDate >= startDate) {
                                            setEndDate(clickedDate);
                                        } else {
                                            setStartDate(clickedDate);
                                            setEndDate(null);
                                        }
                                    }}
                                    tileClassName={({ date }) =>
                                        (startDate && date.toDateString() === startDate.toDateString()) ||
                                        (endDate && date.toDateString() === endDate.toDateString())
                                            ? 'selected-start-date'
                                            : startDate && endDate && date >= startDate && date <= endDate
                                            ? 'selected-range'
                                            : null
                                    }
                                />
                            </Card>
                        </Col>
                        
                        <Col md={5} className="d-flex align-items-center">
                            <Card className="p-4 border-0 shadow-sm w-100" style={{ borderRadius: '12px' }}>
                                <Card.Body>
                                    <h6 className="text-muted mb-3">Your Stay</h6>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-secondary">Check-in:</span>
                                        <span className="fw-bold">{startDate ? startDate.toDateString() : 'Select date'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-secondary">Check-out:</span>
                                        <span className="fw-bold">{endDate ? endDate.toDateString() : 'Select date'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-secondary">Saved:</span>
                                        <span className="text-success fw-bold">
                                            {savedDate ? `${savedDate.startDate?.toDateString()} - ${savedDate.endDate?.toDateString()}` : 'None'}
                                        </span>
                                    </div>
                                    <div className="d-grid gap-2">
                                    <Button variant="dark" onClick={handleSaveDates} className="rounded-pill">Save Dates</Button>
                                        <Button variant="outline-secondary" onClick={() => {
                                            setStartDate(null);
                                            setEndDate(null);
                                            setSavedDate(null);
                                        }} className="rounded-pill">Clear</Button>
                                    </div>

                                {userInfo && (
                                    <Row className="justify-content-center mt-4">
                                        <ListGroup.Item>
                                            <Link to={`/book/${room._id}`}>
                                                <Button className="btn btn-primary w-100">Book Now</Button>
                                            </Link>
                                        </ListGroup.Item>
                                    </Row>
                                )}
                                </Card.Body>
                                
                            {userInfo && room?.lister && userInfo.username === room.lister.username && (
                                <Link to={`/update/room/${room._id}`} className="btn btn-primary">
                                    Edit Listing
                                </Link>
                                )}

                                {userInfo && room?.lister && userInfo.username !== room.lister.username && (
                                <Link to={`/chat/${userInfo.id}/${room.lister.id}`} className="btn btn-primary mt-3">
                                    💬 Message Host
                                </Link>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </>
            ) : (
                <Message variant="warning">Room not found.</Message>
            )}
        </Container>
    );
}

export default RoomScreen;

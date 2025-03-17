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

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [savedDate, setSavedDate] = useState(null);

    useEffect(() => {
        dispatch(listRoomDetails(id));
    }, [dispatch, id]);

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
                            <h2 className="text-primary" style={{ fontSize: '26px' }}>
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
                                    style={{ maxWidth: '700px', borderRadius: '10px' }}
                                />
                            ) : (
                                <Message variant="warning">No image available</Message>
                            )}
                        </Col>
                    </Row>

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

                    <Row className="justify-content-center mt-4">
                        <Col md={8} style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <div style={{ marginRight: '20px' }}>
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
                            <div>
                                <p style={{ fontSize: '15px' }}><strong>Check-in Date:</strong> {startDate ? startDate.toDateString() : 'None'}</p>
                                <p style={{ fontSize: '15px' }}><strong>Checkout Date:</strong> {endDate ? endDate.toDateString() : 'None'}</p>
                                <div>
                                    <Button variant="success" onClick={handleSaveDate} className="mx-1 small-button">
                                        SAVE DATE
                                    </Button>
                                    <Button variant="danger" onClick={handleClearDate} className="mx-1 small-button">
                                        CLEAR DATE
                                    </Button>
                                </div>

                            </div>
                        </Col>
                    </Row>

                    <style>
    {`
.large-calendar {
    width: 300px !important; /* Mas malaki */
    font-size: 16px !important;
}

.large-calendar .react-calendar {
    width: 280px !important;
    font-size: 14px !important;
}

.large-calendar .react-calendar__tile {
    padding: 8px !important;
    font-size: 14px !important;
}

.large-calendar .react-calendar__navigation button {
    font-size: 14px !important;
    padding: 6px !important;
}

.small-calendar .react-calendar__month-view {
    font-size: 8px !important;
}

.small-calendar .react-calendar__tile--active {
    background: rgb(96, 197, 138) !important;
    font-size: 8px !important;
}

/* Para sa mga piniling petsa */
.selected-start-date {
    background: rgb(124, 189, 151) !important;
    color: white !important;
    font-weight: bold !important;
    border-radius: 20px !important;
    padding: 0px !important;
}

.selected-range {
    background: rgb(205, 235, 208) !important;
    color: black !important;
    border-radius: 20px !important;
    padding: 0px !important;
}

/* Para sa piniling araw (days) */
.react-calendar__tile--active {
    background: rgb(96, 197, 138) !important;
    color: black !important;
    font-weight: bold !important;
    border-radius: 20px !important;
    padding: 0px !important;
}

/* Para sa hover effect */
.react-calendar__tile:enabled:hover {
    background: rgb(205, 235, 208) !important;
    color: black !important;
    border-radius: 20px !important;
}

/* Para sa kasalukuyang petsa */
.react-calendar__tile--now {
    background-color: #d3d3d3 !important;
    color: black !important;
    border-radius: 20px !important;
    padding: 0px !important;
}

/* Para sa mga petsang may highlight */
.bold-date {
    font-weight: bold !important;
    background-color: #90ee90 !important;
    color: black !important;
    border-radius: 20px !important;
    padding: 0px !important;
}

/* Default style ng date */
.default-date {
    color: black !important;
    border-radius: 20px !important;
}

/* Pinakamaliit na font para sa ibang date styles */
.date-text {
    font-size: 3px !important;
    margin-top: 0px !important;
}

/* Maliit na button style */
.small-button {
    font-size: 13px !important;
    border-radius: 5px !important;
    margin-left: 35px !important;
    padding: 5px 4px !important;
}

/* ------------ BAGONG CODE PARA SA MONTH VIEW ------------ */

/* ------------ BAGONG CODE PARA SA MONTH TILES LANG ------------ */

/* Pantayin ang font size at padding ng months sa days */
.react-calendar__year-view .react-calendar__tile,
.react-calendar__decade-view .react-calendar__tile {
    font-size: 14px !important; /* Parehas sa Days */
    padding: 15px !important; /* Pantay lang, hindi lumiliit */
    min-width: 50px !important; /* Siguradong hindi masyadong maliit */
    min-height: 50px !important; /* Parehas sa Days */
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

/* Para sa Active o Selected na Month - Ginawang GREEN */
.react-calendar__year-view .react-calendar__tile--active,
.react-calendar__decade-view .react-calendar__tile--active {
    background: rgb(96, 197, 138) !important; /* GREEN na! */
    color: white !important;
    font-weight: bold !important;
    border-radius: 12px !important;
}

/* Para sa Hover Effect sa Months */
.react-calendar__year-view .react-calendar__tile:hover,
.react-calendar__decade-view .react-calendar__tile:hover {
    background: rgb(205, 235, 208) !important;
    color: black !important;
    border-radius: 12px !important;
}

/* Para sa Inactive na Month (Gray) */
.react-calendar__tile:disabled {
    background: #d3d3d3 !important;
    color: black !important;
    border-radius: 12px !important;
}


    `}
</style>
                </>
            )}
        </>
    );
}

export default RoomScreen;

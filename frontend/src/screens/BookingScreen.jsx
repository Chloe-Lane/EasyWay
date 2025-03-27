import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector, useDispatch } from "react-redux";
import { listRoomDetails } from "../actions/roomActions";
import "../screenscss/BookingScreen.css"; // Import updated CSS
import { createBooking } from "../actions/bookingActions";

const BookingScreen = () => {
    const { id } = useParams(); // Room ID
    const dispatch = useDispatch();

    const navigate = useNavigate();
    
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const [name, setName] = useState(userInfo ? userInfo.name : "");
    const [email, setEmail] = useState(userInfo ? userInfo.email : "");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [confirmation, setConfirmation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    

    const booking = useSelector((state) => state.booking);
    const { bookingDates } = booking;

    const roomDetails = useSelector((state) => state.roomDetails);
    const { room } = roomDetails;

    const pricePerDay = room?.price || 0; // Default to 0 kung wala pang data
    const checkInDate = checkIn ? new Date(checkIn) : null;
    const checkOutDate = checkOut ? new Date(checkOut) : null;

    // I-compute ang total days ng stay
    const totalDays = checkInDate && checkOutDate
        ? Math.max(0, (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
        : 0;

    // Compute total price
    const totalPrice = totalDays * pricePerDay;

    useEffect(() => {
        dispatch(listRoomDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        // Auto-fill user details when userInfo is available
        if (userInfo) {
            setName(userInfo.name || "");
            setEmail(userInfo.email || "");
        }
    }, [userInfo]);

    useEffect(() => {
        if (bookingDates?.startDate && bookingDates?.endDate) {
            setCheckIn(bookingDates.startDate);
            setCheckOut(bookingDates.endDate);
        }
    }, [bookingDates]);

    useEffect(() => {
        const savedDates = JSON.parse(localStorage.getItem("bookingDates"));
        if (savedDates) {
            setCheckIn(savedDates.startDate);
            setCheckOut(savedDates.endDate);
        }
    }, []);

    const handleDateClick = (date) => {
        if (!checkIn || (checkIn && checkOut)) {
            setCheckIn(date.toISOString().split("T")[0]);
            setCheckOut("");
        } else if (checkIn && !checkOut && date > new Date(checkIn)) {
            setCheckOut(date.toISOString().split("T")[0]);
        } else {
            setCheckIn(date.toISOString().split("T")[0]);
            setCheckOut("");
        }
    };

    const isWithinRange = (date) => {
        return checkIn && checkOut && date > new Date(checkIn) && date < new Date(checkOut);
    };

    const handleClearDate = () => {
        setCheckIn("");
        setCheckOut("");
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setConfirmation(null);
    
        const formatDate = (date) => {
            const d = new Date(date);
            return d.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
        };
        
        const bookingData = {
            name,
            email,
            check_in: formatDate(checkIn),
            check_out: formatDate(checkOut),
            guests,
            room: parseInt(id),
            payment_status: "Pending",
        };
        
        try {
            const booking = await dispatch(createBooking(bookingData)); // Dispatch Redux action
    
            if (booking) {
                navigate(`/booking-summary/${booking._id}/pay`, {
                    state: {
                        bookingId: booking._id,
                        name,
                        checkIn,
                        checkOut,
                        guests,
                        totalPrice,
                        roomName: room?.name || "Unknown Room",
                    },
                });
    
                setConfirmation("Booking successfully created! 🎉");
            }
        } catch (error) {
            setError("Failed to create booking");
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <div className="container mt-4">
            <h2>Book Your Stay</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {confirmation && <Alert variant="success">{confirmation}</Alert>}

            <Form onSubmit={handleBooking} className="booking-form">
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>

                <Row className="justify-content-center mt-4">
                    <Col md={8} className="calendar-container">
                        <div className="calendar-wrapper">
                            <Calendar
                                className="custom-calendar"
                                onClickDay={handleDateClick}
                                tileClassName={({ date, view }) => {
                                    if (view === 'month') {
                                        if (
                                            (checkIn && date.toISOString().split("T")[0] === checkIn) ||
                                            (checkOut && date.toISOString().split("T")[0] === checkOut)
                                        ) {
                                            return 'selected-date';
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
                            <p><strong>Check-in Date:</strong> {checkIn || 'None'}</p>
                            <p><strong>Checkout Date:</strong> {checkOut || 'None'}</p>
                            <Button variant="danger" onClick={handleClearDate} className="clear-button">
                                Clear Dates
                            </Button>
                        </div>
                    </Col>
                </Row>


                <Form.Group className="mb-3 mt-4">
                    <Form.Label>Number of Guests</Form.Label>
                    <Form.Control
                        type="number"
                        min="1"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        required
                    />
                    <Form.Group className="mb-3">
                        <Form.Label><strong>Total Price:</strong></Form.Label>
                        <Form.Control type="text" value={`₱${totalPrice.toLocaleString()}`} readOnly />
                    </Form.Group>

                </Form.Group>

                <Button type="submit" variant="primary" className="submit-button" disabled={loading}>
                    {loading ? "Submitting..." : "Confirm Booking"}
                </Button>
            </Form>
        </div>
    );
};

export default BookingScreen;

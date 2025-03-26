import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Alert, Row, Col } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";

const BookingScreen = () => {
    const { id } = useParams(); // Room ID
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

    useEffect(() => {
        // Auto-fill user details when userInfo is available
        if (userInfo) {
            setName(userInfo.name || "");
            setEmail(userInfo.email || "");
        }
    }, [userInfo]);

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

    const handlePayment = async () => {
        try {
            const { data } = await axios.post("/api/payment/");
            setConfirmation(data.message);
        } catch (err) {
            setError("Payment failed. Try again.");
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setConfirmation(null);
    
        try {
            const { data, status } = await axios.post("/api/bookings/", {
                room: id,
                name,
                email,
                check_in: checkIn,
                check_out: checkOut,
                guests: Number(guests),
                payment_status: "Completed",  // Simulating a completed payment
            });
    
            if (status === 201) {
                setConfirmation("Booking successfully submitted! 🎉");
                setCheckIn("");
                setCheckOut("");
                setGuests(1);
                setTimeout(() => navigate("/"), 2000);
            } else {
                setError("Booking failed. Please try again.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Booking failed. Please try again.");
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
                </Form.Group>

                <Button onClick={() => handlePayment()} variant="success">
                    Pay Now
                </Button>

                <Button type="submit" variant="primary" className="submit-button" disabled={loading}>
                    {loading ? "Submitting..." : "Confirm Booking"}
                </Button>
            </Form>
        </div>
    );
};

export default BookingScreen;

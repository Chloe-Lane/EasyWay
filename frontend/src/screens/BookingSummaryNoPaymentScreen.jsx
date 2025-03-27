import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container } from "react-bootstrap";
import { getBookingDetails } from "../actions/bookingActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import "../screenscss/BookingSummary.css";

const BookingSummaryNoPayment = () => {
    const { id: bookingId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.userLogin);
    const { loading, error, booking } = useSelector((state) => state.bookingDetails);

    useEffect(() => {
        console.log("User Info:", userInfo);
    }, [userInfo]);    

    useEffect(() => {{
            dispatch(getBookingDetails(bookingId));
        }
    }, [dispatch, bookingId, userInfo, navigate]);

    return (
        <Container className="booking-summary-container">
            <Card className="summary-card">
                <div className="room-image"></div>
                <Card.Body className="summary-details">
                    <h2 className="summary-title">Booking Summary</h2>
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="danger">{error}</Message>
                    ) : (
                        <>
                            <div className="details">
                                <p><strong>Room:</strong> {booking.roomName}</p>
                                <p><strong>Name:</strong> {booking.name}</p>
                                <p><strong>Check-in:</strong> {booking.checkIn}</p>
                                <p><strong>Check-out:</strong> {booking.checkOut}</p>
                                <p><strong>Guests:</strong> {booking.guests}</p>
                            </div>
                            <div className="total-price">
                                <h4>₱{Number(booking.totalPrice).toLocaleString()}</h4>
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BookingSummaryNoPayment;

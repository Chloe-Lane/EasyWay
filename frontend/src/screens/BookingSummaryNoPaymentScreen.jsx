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
        if (!userInfo) {
            navigate("/login");  // Redirect to login if user is not logged in
        } else {
            dispatch(getBookingDetails(bookingId)); // Dispatch action to get booking details
        }
    }, [dispatch, bookingId, userInfo, navigate]);

    useEffect(() => {
        console.log("booking: ", booking); // Log booking data after it gets updated
    }, [booking]);

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
                        booking ? (  // Check if booking is available
                            <>
                                <div className="details">
                                    <p><strong>Room:</strong> {booking.room}</p>
                                    <p><strong>Name:</strong> {booking.name}</p>
                                    <p><strong>Check-in:</strong> {booking.check_in}</p>
                                    <p><strong>Check-out:</strong> {booking.check_out}</p>
                                    <p><strong>Guests:</strong> {booking.guests}</p>
                                </div>
                                <div className="total-price">
                                    <h4>₱{Number(booking.total_price)}</h4>
                                </div>
                            </>
                        ) : (
                            <Message variant="danger">Booking details not found</Message>
                        )
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BookingSummaryNoPayment;

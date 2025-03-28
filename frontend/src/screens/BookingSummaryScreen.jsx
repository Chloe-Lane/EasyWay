import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { getBookingDetails } from "../actions/bookingActions";
import { useParams } from "react-router-dom";
import "../screenscss/BookingSummary.css"; // Import minimalist styles

const BookingSummaryScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paid, setPaid] = useState(false);
    const [sdkReady, setSdkReady] = useState(false); // PayPal script loading state

    const { bookingId } = useParams();
    const { userInfo } = useSelector((state) => state.userLogin);
    const { loading, error, booking } = useSelector((state) => state.bookingDetails);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getBookingDetails(bookingId));
    }, [dispatch, bookingId]);

    const { name, check_in, check_out, guests, total_price, room } = booking || {};


    useEffect(() => {
        if (!check_in || !check_out) {
            navigate("/");
        } else {
            addPayPalScript(); // Adding PayPal script if checkout details are available
        }
    }, [check_in, check_out, navigate]);

    const addPayPalScript = () => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src =
            "https://www.paypal.com/sdk/js?client-id=AZJ4pJl9A8lBjJaGOux1iyN3kq_YlXrqomyeFDI8cf3XKZkpMldp30crcLnPp7NQFgpIRaLs8EvEh3Oi&currency=USD"; // Replace with actual PayPal client ID
        script.async = true;
        script.onload = () => {
            setSdkReady(true); // Set PayPal SDK as ready once the script is loaded
        };
        document.body.appendChild(script);
    };

    const handleApprove = (orderID) => {
        console.log("Payment successful! Order ID:", orderID);
        setPaid(true);
        navigate("/booking/:id", { state: { orderID, total_price } });
    };

    const createOrderHandler = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: total_price.toFixed(2), // Set the total price for the booking
                    },
                },
            ],
        });
    };

    const successPaymentHandler = (paymentResult) => {
        console.log("Payment successful:", paymentResult);
        handleApprove(paymentResult.orderID);
    };

    return (
        <Container className="booking-summary-container">
            <Card className="summary-card">
                {/* Room Image */}
                <div className="room-image"></div>

                {/* Booking Details */}
                <Card.Body className="summary-details">
                    <h2 className="summary-title">Booking Summary</h2>
                    <div className="details">
                        <p><strong>Room:</strong> {room}</p>
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Check-in:</strong> {check_in}</p>
                        <p><strong>Check-out:</strong> {check_out}</p>
                        <p><strong>Guests:</strong> {guests}</p>
                    </div>

                    {/* Total Price */}
                    <div className="total-price">
                        <h4>₱{total_price}</h4>
                    </div>

                    {/* PayPal Integration */}
                    {sdkReady ? (
                        <PayPalScriptProvider
                            options={{ "client-id": "AZJ4pJl9A8lBjJaGOux1iyN3kq_YlXrqomyeFDI8cf3XKZkpMldp30crcLnPp7NQFgpIRaLs8EvEh3Oi" }}
                        >
                            <PayPalButtons
                                createOrder={createOrderHandler}
                                style={{ layout: "vertical" }}
                                onApprove={successPaymentHandler}
                            />
                        </PayPalScriptProvider>
                    ) : (
                        <p>Loading PayPal...</p> // Loading state before PayPal is ready
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BookingSummaryScreen;


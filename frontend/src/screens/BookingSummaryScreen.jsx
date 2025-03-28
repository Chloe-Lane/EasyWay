import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "../screenscss/BookingSummary.css"; // Import minimalist styles

const BookingSummaryScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paid, setPaid] = useState(false);
    const [sdkReady, setSdkReady] = useState(false); // PayPal script loading state

    const { name, checkIn, checkOut, guests, totalPrice, roomName } = location.state || {};

    useEffect(() => {
        if (!checkIn || !checkOut) {
            navigate("/");
        } else {
            addPayPalScript(); // Adding PayPal script if checkout details are available
        }
    }, [checkIn, checkOut, navigate]);

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
        navigate("/booking/:id", { state: { orderID, totalPrice } });
    };

    const createOrderHandler = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: totalPrice.toFixed(2), // Set the total price for the booking
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
                        <p><strong>Room:</strong> {roomName}</p>
                        <p><strong>Name:</strong> {name}</p>
                        <p><strong>Check-in:</strong> {checkIn}</p>
                        <p><strong>Check-out:</strong> {checkOut}</p>
                        <p><strong>Guests:</strong> {guests}</p>
                    </div>

                    {/* Total Price */}
                    <div className="total-price">
                        <h4>₱{totalPrice.toLocaleString()}</h4>
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

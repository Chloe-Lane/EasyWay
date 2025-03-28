import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Container } from "react-bootstrap";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "../screenscss/BookingSummary.css"; // Import minimalist styles

const BookingSummaryScreen = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [paid, setPaid] = useState(false);
    
    const { name, checkIn, checkOut, guests, totalPrice, roomName } = location.state || {};

    useEffect(() => {
        if (!checkIn || !checkOut) {
            navigate("/");
        }
    }, [checkIn, checkOut, navigate]);

    const handleApprove = (orderID) => {
        console.log("Payment successful! Order ID:", orderID);
        setPaid(true);
        navigate("/confirmation", { state: { orderID, totalPrice } });
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
                    <PayPalScriptProvider options={{ "client-id": "AZJ4pJl9A8lBjJaGOux1iyN3kq_YlXrqomyeFDI8cf3XKZkpMldp30crcLnPp7NQFgpIRaLs8EvEh3Oi" }}>
                        <PayPalButtons
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [{
                                        amount: { value: totalPrice.toFixed(2) },
                                    }],
                                });
                            }}
                            onApprove={(data, actions) => {
                                return actions.order.capture().then(details => {
                                    handleApprove(details.id);
                                });
                            }}
                        />
                    </PayPalScriptProvider>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BookingSummaryScreen;

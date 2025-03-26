import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Table, Container, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const BookingHistory = () => {
    const { userInfo } = useSelector((state) => state.userLogin);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await axios.get(
                    `http://127.0.0.1:8000/api/bookings/?email=${userInfo.email}`
                );
                setBookings(data);
            } catch (err) {
                setError("Failed to load booking history.");
            } finally {
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchBookings();
        }
    }, [userInfo]);

    // Function to format timestamp nicely
    const formatDateTime = (timestamp) => {
        return new Date(timestamp).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center">📅 Booking History</h2>

            {loading && (
                <div className="text-center my-4">
                    <Spinner animation="border" />
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && bookings.length === 0 && (
                <Alert variant="info">You have no past bookings.</Alert>
            )}

            {bookings.length > 0 && (
                <Table striped bordered hover responsive className="mt-3">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Place</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Booking Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, index) => (
                            <tr key={booking._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <Link to={`/rooms/${booking.room}`} className="text-decoration-none fw-bold">
                                        {booking.room_name || "Unknown Room"}
                                    </Link>
                                </td>
                                <td>{booking.check_in}</td>
                                <td>{booking.check_out}</td>
                                <td>{formatDateTime(booking.created_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default BookingHistory;

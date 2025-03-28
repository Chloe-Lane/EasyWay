import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Alert, Spinner } from "react-bootstrap";

const BookingRequestsScreen = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await axios.get("https://easyway-backend-e605862abcad.herokuapp.com/bookings/pending/");
                setRequests(data);
            } catch (err) {
                setError("Failed to load booking requests.");
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Booking Requests</h2>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            
            {!loading && requests.length === 0 && (
                <Alert variant="info">No pending requests.</Alert>
            )}

            {requests.length > 0 && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Room</th>
                            <th>Check-in</th>
                            <th>Check-out</th>
                            <th>Guests</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request, index) => (
                            <tr key={request._id}>
                                <td>{index + 1}</td>
                                <td>{request.name}</td>
                                <td>{request.email}</td>
                                <td>{request.room}</td>
                                <td>{request.check_in}</td>
                                <td>{request.check_out}</td>
                                <td>{request.guests}</td>
                                <td><span className="badge bg-warning">Pending</span></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default BookingRequestsScreen;

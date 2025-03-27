import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
import { getMyBookings } from "../actions/bookingActions";

function ProfileScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const bookingListMy = useSelector((state) => state.bookingListMy);
  const { loading: loadingBooking, error: errorBooking, bookings } = bookingListMy;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user || !user.name || success || userInfo._id !== user._id) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
      } else {
        setName(user.name);
        setEmail(user.email);
      }
      dispatch(getMyBookings());
    }
  }, [navigate, userInfo, dispatch, success, user]);

  useEffect(() => {
    console.log("Bookings updated:", bookings);
  }, [bookings]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        updateUserProfile({
          id: user._id,
          name: name,
          email: email,
          password: password,
        })
      );
      setMessage("");
    }
  };

  return (
    <>
      <Row>
        <Col md={3}>
          <h2>User Profile</h2>
          {message && <Message variant="danger">{message}</Message>}
          {error && <Message variant="danger">{error}</Message>}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        </Col>

        <Col md={9}>
          <h2>My Bookings</h2>
          {loadingBooking ? (
            <Loader />
          ) : errorBooking ? (
            <Message variant="danger">{errorBooking}</Message>
          ) : bookings && bookings.length > 0 ? (
            <Table striped responsive className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Created At</th>
                  <th>Room</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking._id}</td>
                    <td>
                      {booking.created_at
                        ? booking.created_at.substring(0, 10)
                        : "N/A"}
                    </td>
                    <td>{booking.room}</td>
                    <td>{booking.check_in}</td>
                    <td>{booking.check_out}</td>
                    <td>{booking.payment_status}</td>
                    <td>
                    <Link
                        to={
                            booking.payment_status.toLowerCase() === "Confirmed"
                                ? `/booking/${booking._id}`
                                : `/booking-summary/${booking._id}/pay`
                        }
                    >
                        <Button className="btn-sm">Details</Button>
                    </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Message>No Bookings Found</Message>
          )}
        </Col>
      </Row>
    </>
  );
}

export default ProfileScreen;

import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userActions';
import FormContainer from '../components/FormContainer';
import Message from '../components/Message';
import Loader from '../components/Loader';



function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState('user'); // Default 'user'
  const [message, setMessage] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'host') {
        navigate('/create-listing');
      } else {
        navigate('/');
      }
    }
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(register(username, email, password, accountType));
    }
  };

  return (
    <FormContainer>
      <Card className="p-4 shadow-sm border-0 rounded-4">
        <h2 className="text-center fw-bold">Register</h2>
        <p className="text-muted text-center">Create your account</p>

        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}

        <Form onSubmit={submitHandler} className="mt-3">
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3"
            />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3"
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3"
            />
          </Form.Group>

          <Form.Group controlId="confirmPassword" className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-3"
            />
          </Form.Group>

          {/* Account Type Selector */}
          <Form.Group controlId="accountType" className="mb-3">
            <Form.Label>Account Type</Form.Label>
            <Form.Select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="p-3"
            >
              <option value="user">User</option>
              <option value="host">Host</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100 p-3 fw-bold">
            Register
          </Button>
        </Form>

        <Row className="py-3 text-center">
          <Col>
            <span className="text-muted">Already have an account?</span>{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="fw-semibold ms-1">
              Login
            </Link>
          </Col>
        </Row>
      </Card>
    </FormContainer>
  );
}

export default RegisterScreen;

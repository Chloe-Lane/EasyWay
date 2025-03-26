import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { login } from "../actions/userActions";
import FormContainer from "../components/FormContainer";
import { setUser } from '../actions/userActions'; // Adjust path as needed

function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;


  useEffect(() => {
    if (userInfo) {
        console.log("✅ User logged in. Setting userId:", userInfo.id);
        localStorage.setItem("userId", userInfo.id);  
        navigate(redirect);
    }
}, [navigate, userInfo, redirect]); 



  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(username, password));
  };

  return (
    <FormContainer>
      <Card className="p-4 shadow-sm border-0 rounded-4">
        <h2 className="text-center fw-bold">Sign In</h2>
        <p className="text-muted text-center">Welcome back! Please login to continue.</p>

        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}

        <Form onSubmit={submitHandler} className="mt-3">
          {/* Username */}
          <Form.Group controlId="username" className="mb-3">
            <Form.Label className="fw-semibold">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3"
            />
          </Form.Group>

          {/* Password */}
          <Form.Group controlId="password" className="mb-3">
            <Form.Label className="fw-semibold">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3"
            />
          </Form.Group>

          {/* Login Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-100 p-3 mt-2 fw-bold"
          >
            Sign In
          </Button>
        </Form>

        {/* Register Link */}
        <Row className="py-3 text-center">
          <Col>
            <span className="text-muted">New here?</span>  
            <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="fw-semibold ms-1">
              Create an account
            </Link>
          </Col>
        </Row>
      </Card>
    </FormContainer>
  );
}

export default LoginScreen;

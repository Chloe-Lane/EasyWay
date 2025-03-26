import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ChatScreen = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatSocket = useRef(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const { userId, hostId } = useParams();
    const roomName = userId < hostId ? `${userId}_${hostId}` : `${hostId}_${userId}`;

    // ✅ Redirect to login if user is not logged in
    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    // ✅ WebSocket Connection
    useEffect(() => {
        if (!userInfo || chatSocket.current) return;

        chatSocket.current = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/`);

        chatSocket.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages((prev) => [
                ...prev,
                `${data.sender_id === userInfo._id ? 'You' : data.sender_username}: ${data.message}`
            ]);
        };

        chatSocket.current.onclose = () => {
            console.log('WebSocket closed');
            chatSocket.current = null;
        };

        return () => {
            chatSocket.current?.close();
            chatSocket.current = null;
        };
    }, [roomName, userInfo]);

    // ✅ Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ✅ Send Message
    const sendMessageHandler = (e) => {
        e.preventDefault();
        if (chatSocket.current && newMessage.trim()) {
            chatSocket.current.send(JSON.stringify({
                sender_id: userInfo._id,
                message: newMessage
            }));
            setNewMessage('');
        }
    };

    return (
        <Card className="container my-5 p-4 shadow-lg rounded">
            <h2 className="text-center mb-4">Chat Room</h2>

            <ListGroup variant="flush" className="mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {messages.map((msg, index) => (
                    <ListGroup.Item key={index}>{msg}</ListGroup.Item>
                ))}
                <div ref={messagesEndRef} />
            </ListGroup>

            <Form onSubmit={sendMessageHandler}>
                <Form.Group controlId="message">
                    <Form.Control
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                </Form.Group>
                <Button type="submit" className="mt-3 w-100">Send</Button>
            </Form>
        </Card>
    );
};

export default ChatScreen;

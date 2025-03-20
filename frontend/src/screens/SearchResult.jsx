import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchRooms } from "../actions/roomActions";
import { useLocation } from "react-router-dom";
import { Card, Container, Row, Col } from "react-bootstrap";

const SearchResults = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const query = new URLSearchParams(location.search).get("q");

    const { rooms } = useSelector((state) => state.searchRooms);

    useEffect(() => {
        if (query) {
            dispatch(searchRooms(query));
        }
    }, [dispatch, query]);

    return (
        <Container>
            <h2 className="mt-4">Search Results for "{query}"</h2>
            <Row>
                {rooms.map((room) => (
                    <Col key={room.id} md={4} className="mb-4">
                        <Card>
                            <Card.Img variant="top" src={room.image} />
                            <Card.Body>
                                <Card.Title>{room.name}</Card.Title>
                                <Card.Text>{room.location}</Card.Text>
                                <Card.Text>Price: ${room.price}</Card.Text>
                                <Card.Text>Rating: {room.rating} ⭐</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SearchResults;

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchRooms } from "../actions/roomActions";
import { useLocation } from "react-router-dom";
import { Container, Card, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "../components/rating";

const SearchResults = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

    const query = queryParams.get("q") || "";
    const amenities = useMemo(() => queryParams.get("amenities")?.split(",") || [], [queryParams]);

    const { rooms = [], loading } = useSelector((state) => state.searchRooms) || { rooms: [] };

    useEffect(() => {
        dispatch(searchRooms(query, amenities));
    }, [dispatch, query, amenities]);

    return (
        <Container fluid className="w-100 mt-5">
            {/* Hero Section (Similar to HomeScreen) */}
            <div className="d-flex flex-column align-items-center justify-content-center text-center py-3" 
                style={{ height: '15vh', width: '100%' }}>
                <h1 className="fw-bold">Search Results</h1>
                <p className="text-muted fs-5">
                    Showing results for "{query || "All Rooms"}" 
                    {amenities.length > 0 && ` filtered by ${amenities.join(", ")}`}
                </p>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center mt-4">
                    <Spinner animation="border" />
                    <p>Loading...</p>
                </div>
            ) : rooms.length > 0 ? (
                <Row className="g-3 justify-content-center">
                    {rooms.map((room) => (
                        <Col key={room.id} lg={2} md={4} sm={6} className="d-flex">
                            <Card className="border-0 shadow-sm rounded-4 w-100">
                                <Link to={`/rooms/${room._id}`}>
                                    <Card.Img
                                        variant="top"
                                        src={room.image}
                                        className="rounded-4 w-100"
                                        style={{ height: '300px', objectFit: 'cover' }}
                                    />
                                </Link>
                                <Card.Body className="text-start">
                                    <Card.Title className="text-truncate fs-6">{room.name}</Card.Title>
                                    <p className="text-muted mb-1" style={{ fontSize: '14px' }}>
                                        <b>{room.location} • {room.distance} km away</b>
                                    </p>
                                    <Rating
                                        value={room.rating}
                                        text={
                                            <span className="d-block" style={{ fontSize: '13px', marginTop: '2px', marginBottom: '10px'}}>
                                                {room.numReviews} reviews
                                            </span>
                                        }
                                        color={'#f8e825'}
                                    />
                                    <Card.Text className="fs-6">
                                        <strong><b>₱{room.price ? room.price : 'N/A'}</b></strong> / night
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p className="text-center mt-4">No results found.</p>
            )}
        </Container>
    );
};

export default SearchResults;

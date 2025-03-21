import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchRooms } from '../actions/roomActions';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, ListGroup, Dropdown, Button, InputGroup } from 'react-bootstrap';
import { FaWifi, FaSwimmingPool, FaDumbbell, FaParking, FaSnowflake, FaUtensils, FaPaw } from "react-icons/fa";


const RoomSearchBar = () => {
    const [query, setQuery] = useState('');
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAmenities, setShowAmenities] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    

    const { rooms = [] } = useSelector((state) => state.searchRooms) || { rooms: [] };

    // Trigger search when query or filters change
    useEffect(() => {
        if (query.length > 1 || selectedAmenities.length > 0) {
            dispatch(searchRooms(query, selectedAmenities));
        } else {
            setShowDropdown(false);
            dispatch(searchRooms('')); // Reset state when input is cleared
        }
    }, [query, selectedAmenities, dispatch]);

    // Handle input change
    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        if (!value.trim()) {
            dispatch(searchRooms(''));
            setShowDropdown(false);
        }
    };

    // Handle search submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (query || selectedAmenities.length > 0) {
            navigate(`/search-results?q=${query}&amenities=${selectedAmenities.join(',')}`);
        }
    };

    // Handle selection from dropdown
    const handleSelect = (name) => {
        setQuery('');
        setShowDropdown(false);
        navigate(`/search-results?q=${name}`);
    };

    // Handle filter selection and navigate instantly
    const toggleAmenity = (amenity) => {
        setSelectedAmenities((prev) => {
            const updatedAmenities = prev.includes(amenity)
                ? prev.filter((a) => a !== amenity)
                : [...prev, amenity];

            navigate(`/search-results?q=${query}&amenities=${updatedAmenities.join(',')}`);
            return updatedAmenities;
        });
    };

    const amenitiesList = [
        { name: "WiFi", icon: <FaWifi /> },
        { name: "Pool", icon: <FaSwimmingPool /> },
        { name: "Gym", icon: <FaDumbbell /> },
        { name: "Parking", icon: <FaParking /> },
        { name: "Air Conditioning", icon: <FaSnowflake /> },
        { name: "Kitchen", icon: <FaUtensils /> },
        { name: "Pets Allowed", icon: <FaPaw /> },
    ];

    return (
        <div className="position-relative" ref={searchRef}>
            <Form onSubmit={handleSubmit}>
                <InputGroup>
                    {/* Search Input */}
                    <FormControl
                        type="search"
                        placeholder="Search rooms..."
                        value={query}
                        onChange={handleChange}
                        onFocus={() => setShowDropdown(rooms.length > 0)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        className="me-2"
                        aria-label="Search"
                    />
                    <Dropdown show={showAmenities} onToggle={(isOpen) => setShowAmenities(isOpen)}>
                        <Dropdown.Toggle variant="outline-secondary" className="px-3 rounded">
                            Filters
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="p-3 shadow-lg rounded" style={{ width: "250px" }}>
                            <div className="d-flex flex-wrap">
                                {amenitiesList.map(({ name, icon }) => (
                                    <div key={name} className="w-50 d-flex align-items-center mb-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedAmenities.includes(name)}
                                            readOnly
                                            className="me-2"
                                            onClick={() => toggleAmenity(name)}
                                        />
                                        {icon} <span className="ms-2">{name}</span>
                                    </div>
                                ))}
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* Search Button */}
                    <Button type="submit" variant="primary">Search</Button>
                </InputGroup>
            </Form>

            {/* Search Suggestions Dropdown */}
            {showDropdown && rooms.length > 0 && (
                <ListGroup className="position-absolute w-100 bg-white border shadow mt-1">
                    {rooms.map((room) => (
                        <ListGroup.Item
                            key={room.id}
                            className="d-flex align-items-center cursor-pointer"
                            onMouseDown={() => handleSelect(room.name)}
                        >
                            {room.image && (
                                <img src={room.image} alt={room.name} className="me-2" width="30" height="30" />
                            )}
                            {room.name} - ${room.price}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
};

export default RoomSearchBar;

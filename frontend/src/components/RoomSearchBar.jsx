import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchRooms } from '../actions/roomActions';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, ListGroup } from 'react-bootstrap';

const RoomSearchBar = () => {
    const [query, setQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchRef = useRef(null);

    const { rooms } = useSelector((state) => state.searchRooms);

    useEffect(() => {
        if (!query) {
            setShowDropdown(false);
            dispatch(searchRooms(''));
        }
    }, [query, dispatch]);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 1) {
            dispatch(searchRooms(value));
            setShowDropdown(true);
        } else {
            setShowDropdown(false);
        }
    };

    const handleSelect = (name) => {
        setQuery('');
        setShowDropdown(false);
        navigate(`/search-results?q=${name}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query) {
            setQuery('');
            setShowDropdown(false);
            navigate(`/search-results?q=${query}`);
        }
    };

    const handleBlur = (e) => {
        if (!searchRef.current.contains(e.relatedTarget)) {
            setShowDropdown(false);
        }
    };

    return (
        <div className="position-relative" ref={searchRef}>
            <Form onSubmit={handleSubmit} className="d-flex">
                <FormControl
                    type="search"
                    placeholder="Search rooms..."
                    value={query}
                    onChange={handleChange}
                    onFocus={() => setShowDropdown(rooms.length > 0)}
                    onBlur={handleBlur}
                    className="me-2"
                    aria-label="Search"
                />
            </Form>

            {/* Dropdown for search suggestions */}
            {showDropdown && rooms.length > 0 && (
                <ListGroup className="position-absolute w-100 bg-white border shadow mt-1">
                    {rooms.map((room) => (
                        <ListGroup.Item
                            key={room._id}
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

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateRoom } from '../actions/roomActions';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Spinner, Alert, Card, Row, Col } from 'react-bootstrap';
import { listRoomDetails } from '../actions/roomActions'; 


const UpdateRoomScreen = () => {
  const { id: roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userLogin);
  const { loading: loadingRoom, error: errorRoom, room } = useSelector((state) => state.roomDetails);
  const { loading: loadingUpdate, error: errorUpdate, success } = useSelector((state) => state.roomUpdate);

  useEffect(() => {
    console.log(userInfo)
  },[userInfo])

  // ✅ State for form fields
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    location: '',
    description: '',
    image: null,
    rating: 0,
    numReviews: 0,
    latitude: '',
    longitude: '',
  });

  // ✅ Fetch room details when the component mounts
  useEffect(() => {
    if (!room || room._id !== roomId) {
      dispatch(listRoomDetails(roomId)); // Fetch room details if not loaded
      console.log(room.lister)
    } else {
      setFormData({
        name: room.name || '',
        price: room.price || '',
        location: room.location || '',
        description: room.description || '',
        image: null,
        rating: room.rating || 0,
        numReviews: room.numReviews || 0,
        latitude: room.latitude || '',
        longitude: room.longitude || '',
      });
    }
  }, [dispatch, roomId, room?._id, room]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Submit handler with FormData for image upload
  const submitHandler = (e) => {
    e.preventDefault();

    const updatedRoomData = new FormData();
    updatedRoomData.append('name', formData.name);
    updatedRoomData.append('price', formData.price);
    updatedRoomData.append('location', formData.location);
    updatedRoomData.append('description', formData.description);
    updatedRoomData.append('rating', formData.rating);
    updatedRoomData.append('numReviews', formData.numReviews);
    updatedRoomData.append('latitude', formData.latitude);
    updatedRoomData.append('longitude', formData.longitude);
    if (formData.image) updatedRoomData.append('image', formData.image);

    dispatch(updateRoom(roomId, updatedRoomData));
    navigate(`/rooms/${roomId}`);
  };


  if (!userInfo || !room?.lister || userInfo.username !== room.lister.username) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">You are not authorized to edit this room.</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="p-4 shadow-lg mt-4">
        <h2 className="text-center mb-4">Update Room</h2>

        {loadingRoom && <Spinner animation="border" className="d-block mx-auto mb-3" />}
        {errorRoom && <Alert variant="danger">{errorRoom}</Alert>}
        {loadingUpdate && <Spinner animation="border" className="d-block mx-auto mb-3" />}
        {errorUpdate && <Alert variant="danger">{errorUpdate}</Alert>}
        {success && <Alert variant="success">Room Updated Successfully!</Alert>}

        <Form onSubmit={submitHandler} encType="multipart/form-data">
          {/* Basic Information */}
          <Card className="p-3 shadow-sm mb-4">
            <h5>Basic Details</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mt-3">
                  <Form.Label>Room Name</Form.Label>
                  <Form.Control name="name" value={formData.name} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mt-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mt-3">
              <Form.Label>Location</Form.Label>
              <Form.Control name="location" value={formData.location} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" rows={3} value={formData.description} onChange={handleChange} />
            </Form.Group>
          </Card>

          {/* Image Upload */}
          <Card className="p-3 shadow-sm mb-4">
            <h5>Media</h5>
            <Form.Group className="mt-3">
              <Form.Label>Upload New Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleChange} />
            </Form.Group>
          </Card>

          {/* Extra Information */}
          <Card className="p-3 shadow-sm mb-4">
            <h5>Additional Details</h5>
            <Row>
              <Col md={4}>
                <Form.Group className="mt-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control type="number" name="rating" step="0.1" value={formData.rating} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Number of Reviews</Form.Label>
                  <Form.Control type="number" name="numReviews" value={formData.numReviews} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mt-3">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control type="number" name="latitude" step="any" value={formData.latitude} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control type="number" name="longitude" step="any" value={formData.longitude} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Button type="submit" className="mt-3 w-100 btn-lg">Update Room</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default UpdateRoomScreen;

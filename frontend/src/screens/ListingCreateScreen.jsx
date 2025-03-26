import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRoom, listAmenities, listPolicies } from '../actions/roomActions';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Spinner, Alert, Card, Row, Col } from 'react-bootstrap';

const ListingCreateScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    location: '',
    description: '',
    selectedAmenityIds: [],
    selectedPolicyIds: [],
    newAmenities: [],
    newPolicies: [],
    amenitiesInput: '',
    policiesInput: '',
    image: null,
    rating: 0,
    numReviews: 0,
    latitude: '',
    longitude: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector((state) => state.roomCreate);
  const { amenities } = useSelector((state) => state.amenityList);
  const { policies } = useSelector((state) => state.policyList);

  useEffect(() => {
    dispatch(listAmenities());
    dispatch(listPolicies());
  }, [dispatch]);

  useEffect(() => {
    if (success) navigate('/');
  }, [success, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckbox = (e, type) => {
    const value = e.target.value;
    const checked = e.target.checked;

    setFormData((prev) => {
      if (type === 'amenity') {
        return {
          ...prev,
          selectedAmenityIds: checked
            ? [...prev.selectedAmenityIds, value]
            : prev.selectedAmenityIds.filter((id) => id !== value),
        };
      } else {
        return {
          ...prev,
          selectedPolicyIds: checked
            ? [...prev.selectedPolicyIds, value]
            : prev.selectedPolicyIds.filter((id) => id !== value),
        };
      }
    });
  };

  const addAmenity = () => {
    if (formData.amenitiesInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        newAmenities: [...prev.newAmenities, formData.amenitiesInput.trim()],
        amenitiesInput: '',
      }));
    }
  };

  const addPolicy = () => {
    if (formData.policiesInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        newPolicies: [...prev.newPolicies, formData.policiesInput.trim()],
        policiesInput: '',
      }));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (!['image', 'selectedAmenityIds', 'selectedPolicyIds', 'newAmenities', 'newPolicies', 'amenitiesInput', 'policiesInput'].includes(key)) {
        data.append(key, value);
      }
    });

    data.append('selected_amenities', JSON.stringify(formData.selectedAmenityIds));
    data.append('new_amenities', JSON.stringify(formData.newAmenities));
    data.append('selected_policies', JSON.stringify(formData.selectedPolicyIds));
    data.append('new_policies', JSON.stringify(formData.newPolicies));

    if (formData.image) data.append('image', formData.image);

    dispatch(createRoom(data));
  };

  return (
    <Container>
      <Card className="p-4 shadow-lg mt-4">
        <h2 className="text-center mb-4">Create Room Listing</h2>

        {loading && <Spinner animation="border" className="d-block mx-auto mb-3" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Room Created Successfully!</Alert>}

        <Form onSubmit={submitHandler}>
          {/* Basic Information */}
          <Card className="p-3 shadow-sm mb-4">
            <h5>Basic Details</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mt-3">
                  <Form.Label>Room Name</Form.Label>
                  <Form.Control name="name" onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mt-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control type="number" name="price" onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mt-3">
              <Form.Label>Location</Form.Label>
              <Form.Control name="location" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" rows={3} onChange={handleChange} />
            </Form.Group>
          </Card>


          {/* Amenities & Policies */}
          <Card className="p-3 shadow-sm mb-4">
            <h5>Amenities & Policies</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mt-3">
                  <Form.Label>Select Existing Amenities</Form.Label>
                  {amenities?.map((amenity) => (
                    <Form.Check key={amenity.id} type="checkbox" label={amenity.name} value={amenity.id} onChange={(e) => handleCheckbox(e, 'amenity')} />
                  ))}
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Add New Amenity</Form.Label>
                  <div className="d-flex">
                    <Form.Control type="text" name="amenitiesInput" value={formData.amenitiesInput} onChange={handleChange} />
                    <Button variant="secondary" className="ms-2" onClick={addAmenity}>Add</Button>
                  </div>
                  <div className="mt-2">
                    {formData.newAmenities.map((item, index) => (
                      <span key={index} className="badge bg-info me-2">{item}</span>
                    ))}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mt-3">
                  <Form.Label>Select Existing Policies</Form.Label>
                  {policies?.map((policy) => (
                    <Form.Check key={policy.id} type="checkbox" label={policy.name} value={policy.id} onChange={(e) => handleCheckbox(e, 'policy')} />
                  ))}
                </Form.Group>

                <Form.Group className="mt-3">
                  <Form.Label>Add New Policy</Form.Label>
                  <div className="d-flex">
                    <Form.Control type="text" name="policiesInput" value={formData.policiesInput} onChange={handleChange} />
                    <Button variant="secondary" className="ms-2" onClick={addPolicy}>Add</Button>
                  </div>
                  <div className="mt-2">
                    {formData.newPolicies.map((item, index) => (
                      <span key={index} className="badge bg-warning text-dark me-2">{item}</span>
                    ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Card>

          {/* Image Upload */}
          <Card className="p-3 shadow-sm mb-4">
            <h5>Media</h5>
            <Form.Group className="mt-3">
              <Form.Label>Upload Image</Form.Label>
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
                  <Form.Control type="number" name="rating" step="0.1" onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Number of Reviews</Form.Label>
                  <Form.Control type="number" name="numReviews" onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mt-3">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control type="number" name="latitude" step="any" onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control type="number" name="longitude" step="any" onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
          </Card>

          <Button type="submit" className="mt-3 w-100 btn-lg">Create Listing</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default ListingCreateScreen;

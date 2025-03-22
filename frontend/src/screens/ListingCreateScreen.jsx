import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRoom, listAmenities, listPolicies } from '../actions/roomActions';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Spinner, Alert } from 'react-bootstrap';

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
  console.log('Amenities:', amenities);
  console.log('Policies:', policies);


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
        const updatedAmenities = checked
          ? [...prev.selectedAmenityIds, value]
          : prev.selectedAmenityIds.filter((id) => id !== value);
        return { ...prev, selectedAmenityIds: updatedAmenities };
      } else {
        const updatedPolicies = checked
          ? [...prev.selectedPolicyIds, value]
          : prev.selectedPolicyIds.filter((id) => id !== value);
        return { ...prev, selectedPolicyIds: updatedPolicies };
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

    // Append basic fields
    Object.entries(formData).forEach(([key, value]) => {
      if (['image', 'selectedAmenityIds', 'selectedPolicyIds', 'newAmenities', 'newPolicies', 'amenitiesInput', 'policiesInput'].includes(key)) return;
      data.append(key, value);
    });

    // Append selected amenities (by IDs) and new amenities (by names)
    data.append('selected_amenities', JSON.stringify(formData.selectedAmenityIds));
    data.append('new_amenities', JSON.stringify(formData.newAmenities));
    data.append('selected_policies', JSON.stringify(formData.selectedPolicyIds));
    data.append('new_policies', JSON.stringify(formData.newPolicies));

    // Image if exists
    if (formData.image) data.append('image', formData.image);

    dispatch(createRoom(data));
  };

  return (
    <Container>
      <h2>Create Room Listing</h2>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Room Created Successfully!</Alert>}

      <Form onSubmit={submitHandler}>
        {/* Basic Details */}
        <Form.Group className="mt-3">
          <Form.Label>Room Name</Form.Label>
          <Form.Control name="name" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Price</Form.Label>
          <Form.Control type="number" name="price" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Location</Form.Label>
          <Form.Control name="location" onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" onChange={handleChange} />
        </Form.Group>

        {/* Existing Amenities */}
        <Form.Group className="mt-3">
          <Form.Label>Select Existing Amenities</Form.Label>
          {amenities?.map((amenity, index) => (
            <Form.Check
              key={amenity.id || index}
              type="checkbox"
              label={amenity.name}
              value={amenity.id}
              onChange={(e) => handleCheckbox(e, 'amenity')}
            />
          ))}
        </Form.Group>

        {/* Add New Amenity */}
        <Form.Group className="mt-3">
          <Form.Label>Add New Amenity</Form.Label>
          <Form.Control
            type="text"
            name="amenitiesInput"
            value={formData.amenitiesInput}
            onChange={handleChange}
          />
          <Button variant="secondary" className="mt-2" onClick={addAmenity}>Add Amenity</Button>
          <div className="mt-2">
            {formData.newAmenities.map((item, index) => (
              <span key={index} className="badge bg-info me-2">{item}</span>
            ))}
          </div>
        </Form.Group>

        {/* Existing Policies */}
        <Form.Group className="mt-3">
          <Form.Label>Select Existing Policies</Form.Label>
          {policies?.map((policy, index) => (
            <Form.Check
              key={policy.id || index}
              type="checkbox"
              label={policy.name}
              value={policy.id}
              onChange={(e) => handleCheckbox(e, 'policy')}
            />
          ))}
        </Form.Group>

        {/* Add New Policy */}
        <Form.Group className="mt-3">
          <Form.Label>Add New Policy</Form.Label>
          <Form.Control
            type="text"
            name="policiesInput"
            value={formData.policiesInput}
            onChange={handleChange}
          />
          <Button variant="secondary" className="mt-2" onClick={addPolicy}>Add Policy</Button>
          <div className="mt-2">
            {formData.newPolicies.map((item, index) => (
              <span key={index} className="badge bg-warning text-dark me-2">{item}</span>
            ))}
          </div>
        </Form.Group>

        {/* Image Upload */}
        <Form.Group className="mt-3">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" name="image" onChange={handleChange} />
        </Form.Group>

        {/* Extra Info */}
        <Form.Group className="mt-3">
          <Form.Label>Rating</Form.Label>
          <Form.Control type="number" name="rating" step="0.1" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Number of Reviews</Form.Label>
          <Form.Control type="number" name="numReviews" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Latitude</Form.Label>
          <Form.Control type="number" name="latitude" step="any" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Longitude</Form.Label>
          <Form.Control type="number" name="longitude" step="any" onChange={handleChange} />
        </Form.Group>

        <Button type="submit" className="mt-4">Create Listing</Button>
      </Form>
    </Container>
  );
};

export default ListingCreateScreen;

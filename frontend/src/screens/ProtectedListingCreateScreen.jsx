import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ListingCreateScreen from './ListingCreateScreen'; // Update with actual file name if needed

const ProtectedListingCreateScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (!userInfo || userInfo.role === 'user') {
      navigate('/');
    }
  }, [userInfo, navigate]);

  return (
    <div style={{ marginTop: '100px' }}>
      <ListingCreateScreen />
    </div>
  );
};

export default ProtectedListingCreateScreen;

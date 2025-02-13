import React from 'react';
import { FaArrowAltCircleDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <button onClick={handleBackClick}>
      <FaArrowAltCircleDown/>
    </button>
  );
};

export default BackButton;

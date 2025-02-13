// src/components/ImageUpload/ImageUpload.js

import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';


const ImageUpload = ({ onUpload }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      onUpload(file);  // Trigger the parent component's upload handler
    }
  };

  const handleUploadClick = () => {
    document.getElementById('image-upload-input').click();
  };

  return (
    <div className="image-upload-container">
      <Button variant="primary" onClick={handleUploadClick}>
        Upload Image
      </Button>
      <Form.File 
        id="image-upload-input"
        style={{ display: 'none' }}
        onChange={handleImageChange}
        accept="image/*"
      />
      {preview && (
        <div className="image-preview">
          <img src={preview} alt="Image Preview" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

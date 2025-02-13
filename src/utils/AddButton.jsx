import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ethers } from 'ethers';
import { db } from './Firebase'; // Adjust this path to your Firebase configuration
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FaWallet } from 'react-icons/fa';
import { useAuth } from '../../hooks/Context';

const AddButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [ethereumAddress, setEthereumAddress] = useState('');
  const [savedAddress, setSavedAddress] = useState('');
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState('');

  // Fetch saved address from Firebase on component mount
const {currentUser} = useAuth();
  
useEffect(() => {
    const fetchAddress = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setSavedAddress(userData.ethereumAddress);
          setEthereumAddress(userData.ethereumAddress);
        } else {
          console.log('No such document!');
        }
      }
    };
    fetchAddress();
  }, [currentUser]);
  

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  console.log(currentUser.uid)

  const handleSaveAddress = async () => {
    if (ethers.utils.isAddress(ethereumAddress)) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, { ethereumAddress }, { merge: true });
        setSavedAddress(ethereumAddress);
        setError('Wallet address added successfully');
        handleClose();
      } catch (error) {
        setError('Failed to save address. Please try again.');
        console.error('Error saving address to Firebase:', error);
      }
    } else {
      setError('Invalid Polygon address.');
    }
  };

  return (
    <>
      <button  style={{textAlign:'center', background:"transparent",width:'100%', textDecoration:'underline purple'}} onClick={handleShow}>
        <FaWallet/> Add Ethereum Address
      </button>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Wallet Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEthereumAddress">
              <Form.Label>Polygon Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Polygon address"
                value={ethereumAddress}
                onChange={(e) => setEthereumAddress(e.target.value)}
                className={error ? 'is-invalid' : ''}
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveAddress}>
            Save Address
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddButton;

import React, { useState } from 'react';
import {
  Box,
  Text,
  Button,
  Alert,
  AlertIcon,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';

const correctPins = ['1234', '5678', '91011', '121314', '151617'];

const PinAuth = ({ onAuthenticate }) => {
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handlePinSubmit = () => {
    if (correctPins.includes(pin)) {
      onAuthenticate();
      setPinError(null);
    } else {
      setPinError('Invalid PIN. Please try again.');
    }
  };

  const handleEmailSubmit = async () => {
    try {
      await axios.post('/api/sendAccessCodes', { email });
      setEmailSuccess('Access codes sent successfully!');
      setEmailError(null);
      onClose();
    } catch (error) {
      setEmailError('Failed to send access codes. Please try again.');
      setEmailSuccess(null);
    }
  };

  return (
    <>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Enter PIN to Access QR Verification Page
      </Text>
      <Input
        placeholder="Enter PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        type="password"
        mb={4}
      />
      <Button onClick={handlePinSubmit} colorScheme="teal" mb={4}>
        Submit
      </Button>
      {pinError && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          {pinError}
        </Alert>
      )}
      <Button onClick={onOpen} colorScheme="blue" mb={4}>
        Get Access Codes
      </Button>
      {emailSuccess && (
        <Alert status="success" mt={4}>
          <AlertIcon />
          {emailSuccess}
        </Alert>
      )}
      {emailError && (
        <Alert status="error" mt={4}>
          <AlertIcon />
          {emailError}
        </Alert>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Access Codes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              mb={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEmailSubmit}>
              Send Access Codes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PinAuth;
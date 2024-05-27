import React, { useState } from 'react';
import { Box, Text, Button, Spinner, Alert, AlertIcon, Input } from '@chakra-ui/react';
import QrScanner from 'react-qr-scanner';
import axios from 'axios';

const correctPins = ['1234', '5678', '91011', '121314', '151617'];

const QRVerificationPage = () => {
  const [data, setData] = useState('No result');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(null);

  const handleScan = async (result) => {
    if (result) {
      console.log(result);
      setData(result.text);
      setIsScanning(false);
      try {
        const response = await axios.post('/api/tickets/verifyTicket', { ticketid: result.text });
        setMessage(response.data.message);
      } catch (error) {
        console.error(error);
        setError(error.response?.data?.error || "Failed to verify ticket");
      }
    }
  };

  const handleError = (error) => {
    console.error(error);
    setError('Failed to scan the QR code. Please try again.');
    setIsScanning(false);
  };

  const handlePinSubmit = () => {
    if (correctPins.includes(pin)) {
      setIsAuthenticated(true);
      setPinError(null);
    } else {
      setPinError('Invalid PIN. Please try again.');
    }
  };

  return (
    <Box p={4}>
      {!isAuthenticated ? (
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
          <Button onClick={handlePinSubmit} colorScheme="teal">
            Submit
          </Button>
          {pinError && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              {pinError}
            </Alert>
          )}
        </>
      ) : (
        <>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            QR Verification Page
          </Text>
          {isScanning ? (
            <>
              <QrScanner
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
              />
              <Spinner size="xl" mt={4} />
            </>
          ) : (
            <Button onClick={() => { setIsScanning(true); setError(null); setMessage(null); }} colorScheme="teal">
              Start Scanning
            </Button>
          )}
          {error && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}
          {message && (
            <Alert status={message === "Ticket used successfully" ? "success" : "warning"} mt={4}>
              <AlertIcon />
              {message}
            </Alert>
          )}
          <Text mt={4}>Scanned Result: {data}</Text>
        </>
      )}
    </Box>
  );
};

export default QRVerificationPage;

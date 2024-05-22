import React, { useState } from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import QrScanner from 'react-qr-scanner';

const QRVerificationPage = () => {
  const [data, setData] = useState('No result');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (result) => {
    if (result) {
      console.log(result);
      setData(result.text);
      setIsScanning(false);
    }
  };

  const handleError = (error) => {
    console.error(error);
    setIsScanning(false);
  };

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold">
        QR Verification Page
      </Text>
      {isScanning ? (
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      ) : (
        <Button onClick={() => setIsScanning(true)}>Start Scanning</Button>
      )}
      <Text mt={4}>Scanned Result: {data}</Text>
    </Box>
  );
};

export default QRVerificationPage;
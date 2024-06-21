import {
  Box,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const Payment = () => {
  return (
    <Box>
      <Heading size={"md"} fontWeight={500} mb={3}>
        Ticket Sales
      </Heading>
      <Box
        borderRadius={"lg"}
        background={useColorModeValue("white", "gray.800")}
        p={3}
      >
        <Heading size={"md"} fontWeight={500}>
          Start Selling Tickets
        </Heading>
        <Text mt={1} fontSize={"sm"} color={"gray.500"}>
          Start selling tickets to your events by creating a Stripe account. It
          usually takes less than 5 minutes to set up.
        </Text>
        <Button
          mt={3}
          bg={useColorModeValue("black", "white")}
          color={useColorModeValue("white", "black")}
          _hover={{
            background: useColorModeValue("gray.700", "gray.300"),
          }}
          p={2}
        >
          Get Started
        </Button>
      </Box>
      <Text mt={2} fontSize={"sm"} color={"gray.500"}>
        Stripe is a secure payment processor with low fees.
      </Text>
    </Box>
  );
};

export default Payment;

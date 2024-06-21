import { CheckIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";

const EvntiqPlus = () => {
  return (
    <Box bg={useColorModeValue("white", "gray.800")} p={3} borderRadius={"lg"}>
      <Flex mb={2}>
        <Box>
          <Text fontSize={"sm"} color={"gray.500"} fontWeight={500}>Upgrade to</Text>
          <Text color={"blue.700"} fontWeight={"bold"} letterSpacing={1} fontSize={'lg'} fontStyle={"italic"}>
            Evntiq Plus
          </Text>
        </Box>
      </Flex>
      <Flex gap={3} flexDir={"column"} mb={3}>
        <Flex alignItems={"center"} gap={2}>
          <CheckIcon color={"green.400"} /> <Text>No Platform fees</Text>
        </Flex>
        <Flex alignItems={"center"} gap={2}>
          <CheckIcon color={"green.400"} /> <Text>Priority Support</Text>
        </Flex>
        <Flex alignItems={"center"} gap={2}>
          <CheckIcon color={"green.400"} /> <Text>5 Admins Included</Text>
        </Flex>
      </Flex>
      <Button
        w={"full"}
        bg={useColorModeValue("black", "white")}
        color={useColorModeValue("white", "black")}
        _hover={{
          background: useColorModeValue("gray.700", "gray.300"),
        }}
      >
        Upgrade
      </Button>
    </Box>
  );
};

export default EvntiqPlus;

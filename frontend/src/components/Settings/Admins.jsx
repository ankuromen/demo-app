import {
  Box,
  Button,
  Flex,
  Heading,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Input,
  List,
  ListItem,
  Badge,
  HStack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";

const Admins = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();

  useEffect(() => {
    const fetchUserSettings = async () => {
      const res = await axios.get("/api/users/settings", {
        params: { userId: user._id },
      });
      setSelectedUsers(res.data.admins);
    };
    fetchUserSettings();
  }, [user]);

  useEffect(() => {}, [selectedUsers]);
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`/api/users/search?q=${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  const isObjectInArray = (array, newAdmin) => {
    console.log("array", array);
    return array.some((item) => item.userid === newAdmin.userid);
  };

  const addObjectToArray = (user) => {
    if (selectedUsers?.length >= 5) {
      alert("You can only select Maximum of 5 users");
      return;
    }
    const newAdmin = {
      name: user.name,
      userid: user._id,
      email: user.email,
    };

    setSelectedUsers((prevItems) => {
      console.log(prevItems);
      if (!isObjectInArray(prevItems, newAdmin)) {
        return [...prevItems, newAdmin];
      }
      showToast("error", "user already added", "error");
      return prevItems;
    });
  };
  const handleAddAdmins = async () => {
    try {
      const res = await axios.post("/api/users/add-admins", {
        userId: user._id,
        selectedUsers,
      });
      setSelectedUsers(res.data);
      showToast("success", "Admins Updated", "success");
      onClose();
    } catch (error) {
      showToast("error", "Something went wrong", "error");
    }
  };

  const handleRemoveAdmin = async (currentUser) => {
    try {
      const res = await axios.post("/api/users/remove-admins", {
        userId: user._id,
        currentUser,
      });
      setSelectedUsers(res.data);
      showToast("success", "Admins Updated", "success");
    } catch (error) {
      showToast("error", "Something went wrong", "error");
    }
  };
  console.log("selectedUsers", selectedUsers);

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"}>
          <Heading as="h1" size="md" mb={4} fontWeight={500}>
            Admins
          </Heading>
          <Button
            size={"sm"}
            bg={useColorModeValue("black", "white")}
            color={useColorModeValue("white", "black")}
            _hover={{
              background: useColorModeValue("gray.700", "gray.300"),
            }}
            p={2}
            gap={2}
            onClick={onOpen}
          >
            <AddIcon boxSize={"0.75em"} />
            Add Admin
          </Button>
        </Flex>
        {selectedUsers.length == 0 && <Text>No Admins</Text>}
        <VStack w={"full"} gap={2}>
          {selectedUsers.map((user) => (
            <Flex
              borderColor={"gray.400"}
              borderRadius={"lg"}
              bg={useColorModeValue("pink.100", "gray.500")}
              p={2}
              justifyContent={"space-between"}
              key={user._id}
              w={"full"}
            >
              <Box>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
              </Box>
              <Button
                colorScheme="red"
                size={"xs"}
                onClick={() => handleRemoveAdmin(user)}
              >
                Remove
              </Button>
            </Flex>
          ))}
        </VStack>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW={"sm"}>
          <ModalHeader>Add Admins</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>Add admins by searching the user</Text>
            <Input
              placeholder="Search user"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <HStack gap={2} mt={2}>
              {selectedUsers.map((user) => {
                return (
                  <Badge colorScheme="green" key={user.email}>
                    {user.name}
                  </Badge>
                );
              })}
            </HStack>

            {searchResults.length > 0 && (
              <List>
                {searchResults.map((result) => (
                  <ListItem key={result._id}>
                    <Box
                      p={2}
                      w={"full"}
                      _hover={{
                        background: useColorModeValue("gray.200", "gray.600"),
                      }}
                      borderRadius={"lg"}
                      onClick={() => addObjectToArray(result)}
                    >
                      <Text
                        _hover={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        <strong>{result.username}</strong> - {result.name}
                      </Text>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              w={"full"}
              onClick={handleAddAdmins}
              bg={useColorModeValue("black", "white")}
              color={useColorModeValue("white", "black")}
              _hover={{
                background: useColorModeValue("gray.700", "gray.300"),
              }}
            >
              Add Admins
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Admins;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Image,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  VStack,
  HStack,
  Heading,
  useToast
} from "@chakra-ui/react";

function Analytics() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/users/all");
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const sortUsers = (criteria) => {
    let sortedUsers = [...users];
    switch (criteria) {
      case "age":
        sortedUsers.sort((a, b) => new Date(b.dob) - new Date(a.dob));
        break;
      case "student":
        sortedUsers.sort((a, b) => b.student - a.student);
        break;
      case "interests":
        sortedUsers.sort((a, b) => b.interests.length - a.interests.length);
        break;
      case "location":
        sortedUsers.sort((a, b) => a.location.localeCompare(b.location));
        break;
      default:
        break;
    }
    setUsers(sortedUsers);
    setSortCriteria(criteria);
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const sendEmails = async () => {
    try {
      await axios.post("/api/users/send-email", { userIds: selectedUsers });
      toast({
        title: "Emails sent",
        description: "Emails have been sent to the selected users.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error sending emails:", error);
      toast({
        title: "Error",
        description: "There was an error sending the emails.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Center py={6}>
      <VStack spacing={4} w="full" maxW="1200px">
        <Heading as="h1" size="xl">Users List</Heading>
        <HStack spacing={4}>
          <Button onClick={() => sortUsers("age")} colorScheme={sortCriteria === "age" ? "blue" : "gray"}>Sort by Age</Button>
          <Button onClick={() => sortUsers("student")} colorScheme={sortCriteria === "student" ? "blue" : "gray"}>Sort by Student Status</Button>
          <Button onClick={() => sortUsers("interests")} colorScheme={sortCriteria === "interests" ? "blue" : "gray"}>Sort by Interests</Button>
          <Button onClick={() => sortUsers("location")} colorScheme={sortCriteria === "location" ? "blue" : "gray"}>Sort by Location</Button>
        </HStack>
        <Button colorScheme="teal" onClick={sendEmails} isDisabled={selectedUsers.length === 0}>
          Send Email to Selected Users
        </Button>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Select</Th>
                <Th>Name</Th>
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Age</Th>
                <Th>Student</Th>
                <Th>Interests</Th>
                <Th>Location</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user._id}>
                  <Td>
                    <Checkbox
                      isChecked={selectedUsers.includes(user._id)}
                      onChange={() => handleCheckboxChange(user._id)}
                    />
                  </Td>
                  <Td>{user.name}</Td>
                  <Td>{user.username}</Td>
                  <Td>{user.email}</Td>
                  <Td>{user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : "N/A"}</Td>
                  <Td>{user.student ? "Yes" : "No"}</Td>
                  <Td>{user.interests.join(", ")}</Td>
                  <Td>{user.location}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
    </Center>
  );
}

export default Analytics;

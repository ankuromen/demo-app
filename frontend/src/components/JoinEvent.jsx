import { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";

const JoinEvent = ({ user, post, joinModalOpen, setJoinModalOpen }) => {
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose: closeJoin } = useDisclosure();
  const [formData, setFormData] = useState({
    tickets: 1,
    name: "",
    email: "",
    contactNo: "",
    age: "",
    males: 0,
    females: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (joinModalOpen) {
      onOpen();
    }
  }, [joinModalOpen]);

  function onCloseJoin() {
    closeJoin();
    setJoinModalOpen(!joinModalOpen);
  }
  const handleSubmit = async () => {
    // Fetch post details before submitting ticket
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`/api/posts/${post._id}`); // Assuming there's an endpoint to fetch post details by ID
        if (!response.ok) {
          throw new Error("Failed to fetch post details");
        }
        const postData = await response.json();
        return postData;
      } catch (error) {
        throw new Error("Failed to fetch post details");
      }
    };

    try {
      // Fetch post details
      const postData = await fetchPostDetails();

      // Submit ticket creation form with post details
      const res = await fetch("/api/tickets/createTicket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: user._id,
          eventid: post._id,
          name: formData.name,
          email: formData.email,
          contactNo: formData.contactNo,
          age: formData.age,
          tickets: formData.tickets,
          males: formData.males,
          females: formData.females,
          eventname: postData.name, // Use fetched post data instead of post.name
          eventdate: postData.startDate, // Use fetched post data instead of post.startDate
          eventtime: postData.startTime, // Use fetched post data instead of post.startTime
          ticketprice: postData.ticketPrice, // Use fetched post data instead of post.ticketPrice
        }),
      });

      if (res.ok) {
        showToast("Success", "Ticket created successfully", "success");
        onCloseJoin();
      } else {
        const data = await res.json();
        console.log(data);
        showToast("Error", data.message, "error");
      }
    } catch (error) {
      showToast("Error", error.message, "error");
      console.log(error);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onCloseJoin}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mt={4}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Contact Number</FormLabel>
            <Input
              type="text"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Age</FormLabel>
            <Input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Number of Tickets</FormLabel>
            <Input
              type="number"
              name="tickets"
              value={formData.tickets}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Number of Males</FormLabel>
            <Input
              type="number"
              name="males"
              value={formData.males}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Number of Females</FormLabel>
            <Input
              type="number"
              name="females"
              value={formData.females}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" size="sm" mr={3} onClick={handleSubmit}>
            Pay
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default JoinEvent;

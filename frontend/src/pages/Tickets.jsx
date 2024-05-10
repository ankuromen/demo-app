import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";

const Tickets = () => {
  const user = useRecoilValue(userAtom); // Get The user data from Recoil atom
  const [tickets, setTickets] = useState([]);
  console.log(user._id);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (user) {
      // If user data is available, fetch tickets associated wiTh The user
      const fetchTickets = async () => {
        try {
          const response = await axios.get(
            `/api/tickets/gettickets/${user._id}`
          ); // Changed to user._id
          setTickets(response.data);
        } catch (error) {
          console.error("Error fetching tickets:", error);
        }
      };

      fetchTickets();
    }
  }, [user]);
  // Fetch tickets whenever user data changes
  console.log(tickets);
  return (
    <Flex w={"full"} flexDirection={"column"} alignItems={"center"} gap={"4"}>
      <Heading size={"lg"}>Your Tickets</Heading>
      <Table size={"sm"}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Contact No</Th>
            <Th>Count</Th>
            <Th>Event Name</Th>
            <Th>Event Date</Th>
            <Th>Event Time</Th>
            <Th>Price</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {tickets.map((ticket) => (
            <Tr key={ticket._id}>
              <Td>{ticket.ticketDetails.name}</Td>
              <Td>{ticket.ticketDetails.email}</Td>
              <Td>{ticket.ticketDetails.contactNo}</Td>
              <Td>{ticket.ticketDetails.count}</Td>
              <Td>{ticket.ticketDetails.eventname}</Td>
              <Td>
                {new Date(ticket.ticketDetails.eventdate).toLocaleDateString()}
              </Td>
              <Td>{ticket.ticketDetails.eventtime}</Td>
              <Td>{ticket.ticketDetails.ticketprice}</Td>
              <Td>
                <Button size={"sm"} colorScheme="blue" onClick={onOpen}>
                  More
                </Button>
              </Td>
              <Modal
                isOpen={isOpen}
                onClose={onClose}
                ticket={ticket}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader textAlign={"center"}>Event Details</ModalHeader>
                  <ModalCloseButton size={"sm"} />
                  <ModalBody>
                    <Box
                      borderWidth={"1px"}
                      borderRadius={"lg"}
                      overflow={"hidden"}
                      border={"1px"}
                      borderColor={"gray.500"}
                    >
                      <Box p={"6"} background={""}>
                        <Box mt={"1"} fontWeight={"semibold"} as={"h4"}>
                          Event Name : {ticket.ticketDetails.eventname}
                          <br />
                          Name : {ticket.ticketDetails.name}
                          <br />
                          Ticket Price : {ticket.ticketDetails.ticketprice}
                        </Box>
                      </Box>
                    </Box>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
};

export default Tickets;

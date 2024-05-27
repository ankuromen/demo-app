import { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom.js";
import QRCode from "react-qr-code";
import {
  Box,
  Flex,
  Heading,
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Toast,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast.js";

const TicketsPage = () => {
  const user = useRecoilValue(userAtom); // Get The user data from Recoil atom
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showToast = useShowToast();

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

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    onOpen();
  };

  const handleCheckIn = async (selectedTicket) => {
    try {
      const res = await axios.put(
        `/api/posts/checkin/${selectedTicket.eventid._id}`,
        {
          ticketId: selectedTicket._id,
        }
      );
      const data =await res.data
      showToast("success",data.message,"success")
      onClose()
    } catch (error) {
      showToast("Error","error");
    }
  };
  return (
    <Flex w={"100%"} flexDirection={"column"} alignItems={"center"} gap={"4"}>
      <Heading size={"lg"}>My Tickets</Heading>
      {tickets.map((ticket) => (
        <Flex
          key={ticket._id}
          bgGradient="linear(to-r,#ad5389, #3c1053)"
          h={"fit-content"}
          p={3}
          w={{sm:'90%',md:"80%",lg:'60%'}}
          borderRadius={"md"}
          justifyContent={"space-between"}
          onClick={() => handleOpenTicket(ticket)}
        >
          <Box>
            <Text fontSize={"md"} fontWeight={"500"}>
              Event : {ticket.ticketDetails.eventname}
            </Text>
            <Text fontSize={"md"} fontWeight={"500"}>
              Venue : {ticket.eventid.venue}
            </Text>
            <Text fontSize={"md"} fontWeight={"500"}>
              No.of Tickets : {ticket.ticketDetails.count}
            </Text>
            <Text fontSize={"md"} fontWeight={"500"}>
              Start :{" "}
              {new Date(ticket.ticketDetails.eventdate).toLocaleDateString([], {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </Box>
          {ticket.eventid.img && (
            <Box
              w={"25%"}
              h={"100px "}
              background={"white"}
              alignSelf={"flex-end"}
              borderRadius={"md"}
              objectFit={"contain"}
              overflow={"hidden"}
            >
              <Image h={"100%"} w={"100%"} src={ticket.eventid.img} />
            </Box>
          )}
          <Modal isOpen={isOpen} onClose={onClose} mt={0}>
            <ModalOverlay />
            <ModalContent
              bgGradient="linear(to-l, #7928CA, #FF0080)"
              borderRadius={"1em"}
            >
              <ModalHeader textAlign={"center"}>Ticket Details</ModalHeader>
              <Button
                colorScheme="green"
                size={"xs"}
                mt={"1"}
                onClick={() => handleCheckIn(selectedTicket)}
              >
                Check In
              </Button>
              <ModalCloseButton size={"md"} />
              <ModalBody>
                <Box
                  borderWidth={"1px"}
                  borderRadius={"1em"}
                  border={"1px"}
                  borderColor={"gray.500"}
                >
                  {selectedTicket && (
                    <Box p={"6"} background={""}>
                      {selectedTicket.eventid.img && (
                        <Box
                          w={"100%"}
                          h={"200px"}
                          background={"white"}
                          alignSelf={"flex-end"}
                          borderRadius={"1em"}
                          objectFit={"contain"}
                          overflow={"hidden"}
                          mb={"3"}
                        >
                          <Image
                            h={"100%"}
                            w={"100%"}
                            src={selectedTicket.eventid.img}
                          />
                        </Box>
                      )}
                      <Box mt={"1"} fontWeight={"semibold"} as={"h4"}>
                        Event Name : {selectedTicket.ticketDetails.eventname}
                        <br />
                        User Name : {selectedTicket.ticketDetails.name}
                        <br />
                        Ticket Price :{" "}
                        {selectedTicket.ticketDetails.ticketprice}
                        <br />
                        My Contact : {selectedTicket.ticketDetails.contactNo}
                        <br />
                        Start :{" "}
                        {new Date(
                          selectedTicket.ticketDetails.eventdate
                        ).toLocaleDateString([], {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                        <br />
                        Time : {selectedTicket.ticketDetails.eventtime}
                        <br />
                        Venue : {selectedTicket.eventid.venue} (
                        {selectedTicket.eventid.eventType})
                        <br />
                      </Box>
                      <QRCode
                        size={256}
                        style={{
                          marginTop: "1em",
                          height: "100px",
                          maxWidth: "60%",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                        value={selectedTicket._id}
                        viewBox={`0 0 256 256`}
                      />
                    </Box>
                  )}
                </Box>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      ))}
    </Flex>
  );
};

export default TicketsPage;

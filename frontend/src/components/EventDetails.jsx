import {
  Box,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";

const EventDetails = ({
  isEventDetailsOpen,
  onEventDetailsOpen,
  onEventDetailsClose,
  selectedEvent,
}) => {
  const showToast = useShowToast();

  const handleCheckIn = async (selectedEvent) => {
    console.log("handlecheckIn");
    console.log(selectedEvent);
    try {
      const res = await axios.put(
        `/api/posts/checkin/${selectedEvent.eventId}`,
        {
          ticketId: selectedEvent.id,
        }
      );
      const data = await res.data;
      showToast("success", data.message, "success");
      onEventDetailsClose();
    } catch (error) {
      showToast("Error", "error");
    }
  };
  return (
    <>
      {" "}
      <Modal isOpen={isEventDetailsOpen} onClose={onEventDetailsClose}>
        <ModalOverlay />
        <ModalContent
          bgGradient="linear(to-t, #37ecba 0%, #72afd3 100%)"
          borderRadius={"1em"}
        >
          <ModalHeader textAlign={"center"}>Event Details</ModalHeader>
          <ModalCloseButton size={"md"} />
          <ModalBody>
            <Box
              borderWidth={"1px"}
              borderRadius={"1em"}
              overflow={"hidden"}
              border={"1px"}
              borderColor={"gray.500"}
            >
              {selectedEvent && (
                <Box p={"6"} background={""}>
                  {selectedEvent.img && (
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
                      <Image h={"100%"} w={"100%"} src={selectedEvent.img} />
                    </Box>
                  )}
                  <Box mt={"1"} fontWeight={"semibold"} as={"h4"}>
                    Event Name : {selectedEvent.event}
                    <br />
                    {selectedEvent.category === "ticket"
                      ? "User Name"
                      : "Posted By"}{" "}
                    : {selectedEvent.name}
                    <br />
                    Ticket Price : {selectedEvent.price}
                    <br />
                    Start :{" "}
                    {new Date(selectedEvent.start).toLocaleDateString([], {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    <br />
                    Time : {selectedEvent.time}
                    <br />
                    Venue : {selectedEvent.venue} ({selectedEvent.type})
                    <br />
                  </Box>
                </Box>
              )}
            </Box>
          </ModalBody>
          <ModalFooter>
            {selectedEvent?.category && selectedEvent.category=== "ticket" && (
              <Button
                colorScheme="blue"
                alignSelf={"center"}
                justifySelf={"center"}
                size={"sm"}
                mt={"1"}
                ms={"auto"}
                color={"white"}
                onClick={() => handleCheckIn(selectedEvent)}
              >
                Check In
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EventDetails;

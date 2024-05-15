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
} from "@chakra-ui/react";
const EventDetails = ({
  isEventDetailsOpen,
  onEventDetailsOpen,
  onEventDetailsClose,
  selectedEvent,
}) => {
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
            {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EventDetails;

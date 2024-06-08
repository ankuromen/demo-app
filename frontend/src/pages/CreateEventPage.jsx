import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
  Text,
  VStack,
  border,
  useDisclosure,
} from "@chakra-ui/react";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { CiGlobe, CiLocationOn, CiStickyNote } from "react-icons/ci";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";

const MAX_CHAR = 500;
const timeZones = [
  { value: "GMT-12", label: "Baker Island Time (BIKT)" },
  { value: "GMT-11", label: "Samoa Time (SST)" },
  { value: "GMT-10", label: "Hawaii-Aleutian Time (HST)" },
  { value: "GMT-9", label: "Alaska Time (AKST)" },
  { value: "GMT-8", label: "Pacific Time (PST)" },
  { value: "GMT-7", label: "Mountain Time (MST)" },
  { value: "GMT-6", label: "Central Time (CST)" },
  { value: "GMT-5", label: "Eastern Time (EST)" },
  { value: "GMT-4", label: "Atlantic Time (AST)" },
  { value: "GMT-3.5", label: "Newfoundland Time (NST)" },
  { value: "GMT-3", label: "West Africa Time (WAT)" },
  { value: "GMT-2", label: "Mid-Atlantic Time (MAT)" },
  { value: "GMT-1", label: "Western European Time (WET)" },
  { value: "GMT+1", label: "Central European Time (CET)" },
  { value: "GMT+2", label: "Eastern European Time (EET)" },
  { value: "GMT+3", label: "Moscow Time (MSK)" },
  { value: "GMT+4", label: "Astrakhan Time (Astrakhan Time)" },
  { value: "GMT+5", label: "Pakistan Time (PKT)" },
  { value: "GMT+5.5", label: "India Time (IST)" },
  { value: "GMT+6", label: "Bangladesh Time (BDT)" },
  { value: "GMT+7", label: "Krasnoyarsk Time (KRAT)" },
  { value: "GMT+8", label: "China Standard Time (CST)" },
  { value: "GMT+9", label: "Japan Standard Time (JST)" },
  { value: "GMT+12", label: "Kiribati Time (Kiritimati Time)" },
];

const CreateEventPage = () => {
  const [postText, setPostText] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();

  // Additional Fields
  const [postName, setPostName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [venue, setVenue] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [eventType, setEventType] = useState("");
  // const [category, setCategory] = useState("");
  // const [subCategory, setSubCategory] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [isFree, setIsFree] = useState(true); // State to manage free ticket price
  const [isPrivate, setIsPrivate] = useState(false);
  const [ticketSalesStartDate, setTicketSalesStartDate] = useState("");
  const [ticketSalesStartTime, setTicketSalesStartTime] = useState("");
  const [requireApproval, setRequireApproval] = useState(false);
  const [isUnlimited, setIsUnlimited] = useState(true);
  const inputRef = useRef();
  const libraries = ["places"];
  const {
    isOpen: isOpenEditDescmodal,
    onOpen: openEditDescModal,
    onClose: closeEditDescModal,
  } = useDisclosure();

  useEffect(() => {
    if (isUnlimited) {
      setCapacity(9999);
    }
  }, [isUnlimited]);

  useEffect(() => {
    if (!ticketSalesStartDate) {
      setTicketSalesStartDate(new Date().toJSON().split("T")[0]);
      setTicketSalesStartTime(
        `${new Date().getHours()}:${new Date().getMinutes()}`
      );
    }
  }, [ticketSalesStartDate]);

  const handlePlaceChanged = async () => {
    const [place] = await inputRef.current.getPlaces()[0];

    if (place) {
      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());
      setVenue(place.formatted_address);
    }
  };

  const debouncedHandlePlaceChanged = useCallback(
    debounce(handlePlaceChanged, 300),
    []
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addListener(
        "places_changed",
        debouncedHandlePlaceChanged
      );
    }
    return () => {
      if (inputRef.current) {
        inputRef.current.removeListener(
          "places_changed",
          debouncedHandlePlaceChanged
        );
      }
    };
  }, [debouncedHandlePlaceChanged]);

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    if ((eventType === "Hybrid" || eventType === "Physical") && !venue) {
      showToast("Error", "Please provide a venue for the event.", "error");
      showToast();
      return;
    }
    if ((eventType === "Hybrid" || eventType === "Virtual") && !meetingLink) {
      showToast(
        "Error",
        "Please provide a meeting link for the event.",
        "error"
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          name: postName,
          text: postText,
          img: imgUrl,
          startDate,
          startTime,
          endDate,
          endTime,
          timeZone,
          venue,
          meetingLink,
          ticketPrice: isFree ? 0 : ticketPrice, // Set ticket price as 0 if it's free
          capacity,
          eventType,
          ticketSalesStartDate,
          ticketSalesStartTime,
          isPrivate,
          requireApproval,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Event created successfully", "success");
      if (username === user.username) {
        setPosts([data, ...posts]);
      }

      setPostName("");
      setPostText("");
      setImgUrl("");
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
      setTimeZone("");
      setVenue("");
      setMeetingLink("");
      setTicketPrice("");
      setCapacity("");
      setEventType("");
      setTicketSalesStartDate("");
      setTicketSalesStartTime("");
      setIsFree(false); // Reset free ticket price state
      setIsPrivate(false); // Reset private post setting state
      setRequireApproval(false);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Grid
        gridTemplateColumns={{ base: "1fr", md: "1fr 2fr" }}
        maxW={{ base: "95%", lg: "55%" }}
        margin={"auto"}
        alignItems={"start"}
      >
        {/* Image Part */}
        <Flex w="100%" direction={"column"} p={3}>
          <Box
            borderRadius={15}
            overflow={"hidden"}
            w={{ base: "full", md: 300 }}
            h={310}
            alignItems={"center"}
            justifyContent={"center"}
            margin={"auto"}
          >
            <Image
              src={
                imgUrl
                  ? imgUrl
                  : "https://images.pexels.com/photos/17151646/pexels-photo-17151646/free-photo-of-one-transparent-compact-audio-cassette-with-visible-tape-and-red-inner-reels-isolated-on-blue-background-top-down-view-flat-lay-with-empty-space-for-text.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
              w={"full"}
              h={"full"}
            />
          </Box>
        </Flex>

        {/* Right Side */}
        <Flex w="100%" p={3} direction={"column"}>
          {/* Public/Private  */}
          <Flex alignItems={"end"} justifyContent={"end"}>
            <Popover>
              <PopoverTrigger>
                <Button
                  size={"xs"}
                  bg="rgba(218, 218, 218, 0.68)"
                  _hover={{ bg: "blue.600", color: "white" }}
                >
                  <RiGitRepositoryPrivateFill />
                  Private
                </Button>
              </PopoverTrigger>
              <PopoverContent boxShadow="md" w={"2xs"}>
                <PopoverArrow />
                <PopoverBody p={0.5}>
                  <Flex
                    flexDirection={"row"}
                    alignItems={"center"}
                    p={1}
                    gap={2}
                    borderRadius={"lg"}
                    _hover={{ bg: "gray.100" }}
                  >
                    <CiGlobe />
                    Public
                  </Flex>
                  <Flex
                    flexDirection={"row"}
                    alignItems={"center"}
                    p={1}
                    borderRadius={"lg"}
                    gap={2}
                    _hover={{ bg: "gray.100" }}
                  >
                    <RiGitRepositoryPrivateFill />
                    Private
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
          {/* Event NAme Input */}
          <Input
            size={"lg"}
            p={3}
            variant={"unstyled"}
            fontSize={"5xl"}
            letterSpacing={1}
            fontWeight={"500"}
            placeholder="Event Name"
            value={postName}
            onChange={(e) => setPostName(e.target.value)}
          />
          {/* Date Part */}
          <Grid gridTemplateColumns={{ base: "1fr", md: "3fr 1fr" }} gap={2}>
            <Flex bg={"gray.200"} borderRadius={"md"} gap={2} p={1}>
              <Flex
                alignItems={"center"}
                justifyContent={"space-around"}
                flexDir={"column"}
                position={"relative"}
                ms={4}
              >
                <Box
                  width="10px"
                  height="10px"
                  bg="gray.400"
                  borderRadius="50%"
                ></Box>
                <Box
                  width="0.25px"
                  height="25px"
                  bg="transparent"
                  borderStyle="dashed"
                  borderWidth="1px"
                  borderColor="gray.400"
                  position="absolute"
                ></Box>
                <Box
                  width="10px"
                  height="10px"
                  bg="gray.100"
                  borderWidth={"1px"}
                  borderColor={"gray.500"}
                  borderRadius="50%"
                ></Box>
              </Flex>
              <Flex
                justifyContent={"space-evenly"}
                flexDir={"column"}
                color={"gray.500"}
              >
                <Text fontSize={"xl"} letterSpacing={0.75} fontWeight={400}>
                  Start
                </Text>
                <Text fontSize={"xl"} letterSpacing={0.75} fontWeight={400}>
                  End
                </Text>
              </Flex>

              <Box borderRadius="md" ms={"auto"}>
                <VStack spacing={0} align="start">
                  <Flex align="center">
                    <Flex ml="auto">
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        size="md"
                      />
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        size="sm"
                        ml={2}
                      />
                    </Flex>
                  </Flex>
                  <Flex align="center">
                    <Flex ml="auto">
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        size="md"
                      />
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        size="sm"
                        ml={2}
                      />
                    </Flex>
                  </Flex>
                </VStack>
              </Box>
            </Flex>

            <Flex bg={"gray.200"} borderRadius={"md"}>
              <Select
                bg={"gray.200"}
                borderRadius={"md"}
                value={timeZone}
                variant="flushed"
                size={"lg"}
                height={50}
                fontSize={"lg"}
                p={2}
                borderColor={"transparent"}
                icon={"none"}
                onChange={(e) => setTimeZone(e.target.value)}
              >
                <option value="">Time Zone</option>
                {timeZones.map((zone) => (
                  <option key={zone.value} value={zone.value}>
                    {zone.label}
                  </option>
                ))}
              </Select>
            </Flex>
          </Grid>
          {/* location part*/}
          <Popover style={{ minWidth: "100%" }}>
            <PopoverTrigger>
              <Flex
                bg={"gray.200"}
                borderRadius={"md"}
                mt={2}
                flexDir={"column"}
                p={3}
                gap={2}
                w="full"
              >
                <Flex flexDir={"row"} alignItems={"center"} gap={2}>
                  <CiLocationOn size={20} />
                  <Text fontSize={"lg"} fontWeight={500} color={"gray.600"}>
                    Add Event Type and Location
                  </Text>
                </Flex>
                <Flex ps={6}>
                  <Text>Offline location or virtual link</Text>
                </Flex>
              </Flex>
            </PopoverTrigger>
            <PopoverContent boxShadow="md" style={{ minWidth: "100" }}>
              <PopoverBody style={{ minWidth: "100%" }}>
                <Select
                  placeholder="Event Type"
                  value={eventType}
                  size={"lg"}
                  onChange={(e) => setEventType(e.target.value)}
                  variant="flushed"
                  style={{ minWidth: "100%" }}
                >
                  <option value="Physical">Physical</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Hybrid">Hybrid</option>
                </Select>
                {["Physical", "Hybrid"].includes(eventType) && (
                  <LoadScript
                    style={{ width: "100%" }}
                    googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
                    libraries={libraries}
                  >
                    <StandaloneSearchBox
                      onLoad={(ref) => (inputRef.current = ref)}
                      onPlacesChanged={handlePlaceChanged}
                    >
                      <Input
                        type="text"
                        style={{ width: "100%" }}
                        placeholder="Venue"
                        onChange={(e) => setVenue(e.target.value)}
                      />
                    </StandaloneSearchBox>
                  </LoadScript>
                )}
                {["Virtual", "Hybrid"].includes(eventType) && (
                  <>
                    <Button
                      _hover={{ bg: "gray.100" }}
                      bg="none"
                      style={{ width: "100%" }}
                    >
                      Create Zoom Meeting
                    </Button>
                    <Button
                      _hover={{ bg: "gray.100" }}
                      bg="none"
                      style={{ width: "100%" }}
                    >
                      Select Existing Zoom Link
                    </Button>
                  </>
                )}
                <Button colorScheme="blue" style={{ minWidth: "100%" }}>
                  Save
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          {/* description */}
          <Flex
            bg={"gray.200"}
            borderRadius={"md"}
            mt={2}
            flexDir={"column"}
            p={3}
            gap={2}
            w="full"
            onClick={openEditDescModal}
          >
            <Flex flexDir={"row"} alignItems={"center"} gap={2}>
              <CiStickyNote size={20} />
              <Text fontSize={"lg"} fontWeight={500} color={"gray.600"}>
                Description
              </Text>
            </Flex>
            <Flex ps={6}>
              <Text>{postText? postText:""}</Text>

            </Flex>
          </Flex>
          <Modal
            isOpen={isOpenEditDescmodal}
            onClose={closeEditDescModal}
            motionPreset
            isCentered
          >
            <ModalOverlay />
            <ModalContent borderRadius="15px" overflow={"hidden"}>
              <ModalHeader bg={"gray.100"}>Event Description</ModalHeader>
              <ModalCloseButton />
              <Input
                minH={"200"}
                onChange={handleTextChange}
                value={postText}
              />

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={closeEditDescModal}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

        {/* EventOptions */}
        <Text fontSize={'lg'} mt={3} fontWeight={500} color={'gray.600'}>Event Options</Text>
        </Flex>
      </Grid>
    </>
  );
};
border;

export default CreateEventPage;

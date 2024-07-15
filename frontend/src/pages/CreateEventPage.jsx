import {
  Box,
  Button,
  Flex,
  Grid,
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
  PopoverHeader,
  PopoverTrigger,
  Select,
  Switch,
  Text,
  VStack,
  border,
  useDisclosure,
} from "@chakra-ui/react";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { CiGlobe, CiLocationOn, CiStickyNote, CiEdit } from "react-icons/ci";
import { PiSeatbelt } from "react-icons/pi";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { IoTicketOutline } from "react-icons/io5";
import { FcPicture } from "react-icons/fc";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useNavigate, useParams } from "react-router-dom";
import { debounce } from "lodash";
import { BsFillImageFill } from "react-icons/bs";

import {
  setKey,
  setDefaults,
  setLanguage,
  setRegion,
  fromAddress,
  fromLatLng,
  fromPlaceId,
  setLocationType,
  geocode,
  RequestType,
} from "react-geocode";
setDefaults({
  key: import.meta.env.VITE_GOOGLE_GEOLOCATION_KEY, // Your API key here.
  language: "en", // Default language for responses.
  region: "es", // Default region for responses.
});
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
const categories = ["Music", "Technology", "Business", "Networking"];

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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [venue, setVenue] = useState("");
  const [venueLatitude, setVenueLatitude] = useState();
  const [venueLongitude, setVenueLongitude] = useState();
  const [ticketPrice, setTicketPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [eventType, setEventType] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [isFree, setIsFree] = useState(true); // State to manage free ticket price
  const [isPrivate, setIsPrivate] = useState(false);
  const [ticketSalesStartDate, setTicketSalesStartDate] = useState("");
  const [ticketSalesStartTime, setTicketSalesStartTime] = useState("");
  const [requireApproval, setRequireApproval] = useState(false);
  const [isUnlimited, setIsUnlimited] = useState(true);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const inputRef = useRef();
  const [isEventTypeOpen, setIsEventTypeOpen] = useState(false);
  const {
    isOpen: isOpenEditDescmodal,
    onOpen: openEditDescModal,
    onClose: closeEditDescModal,
  } = useDisclosure();
  const {
    isOpen: isOPenCapacitySet,
    onOpen: onOpenCapcaitySet,
    onClose: OnCloseCapacitySet,
  } = useDisclosure();

  useEffect(() => {
    if (isUnlimited) {
      setCapacity(9999);
    }
  }, [isUnlimited]);

  useEffect(() => {
    geocode(RequestType.LATLNG, `${venueLatitude},${venueLongitude}`, {
      location_type: "ROOFTOP", // Override location type filter for this request.
      enable_address_descriptor: true, // Include address descriptor in response.
    })
      .then(({ results }) => {
        const address = results[0].formatted_address;
        const { city, state, country } = results[0].address_components.reduce(
          (acc, component) => {
            if (component.types.includes("administrative_area_level_3"))
              acc.city = component.long_name;
            else if (component.types.includes("administrative_area_level_1"))
              acc.state = component.long_name;
            else if (component.types.includes("country"))
              acc.country = component.long_name;
            return acc;
          },
          {}
        );
        setCity(city);
        setState(state);
        setCountry(country);
      })
      .catch(console.error);
  }, [venueLatitude, venueLongitude]);

  useEffect(() => {
    if (!ticketSalesStartDate) {
      setTicketSalesStartDate(new Date().toJSON().split("T")[0]);
      setTicketSalesStartTime(
        `${new Date().getHours()}:${new Date().getMinutes()}`
      );
    }
  }, [ticketSalesStartDate]);

  const handlePlaceChanged = async () => {
    const [place] = await inputRef.current.getPlaces();

    if (place) {
      // console.log(place.geometry.location.lat());
      // console.log(place.geometry.location.lng());
      setVenue(place.formatted_address);
      setVenueLatitude(place.geometry.location.lat());
      setVenueLongitude(place.geometry.location.lng());
    }
  };
  // const handlePlaceChanged = async () => {
  //   const [place] = await inputRef.current.getPlaces()[0];

  //   if (place) {
  //     console.log(place.geometry.location.lat());
  //     console.log(place.geometry.location.lng());
  //     setVenue(place.formatted_address);
  //   }
  // };

  // const debouncedHandlePlaceChanged = useCallback(
  //   debounce(handlePlaceChanged, 300),
  //   []
  // );

  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.addListener(
  //       "places_changed",
  //       debouncedHandlePlaceChanged
  //     );
  //   }
  //   return () => {
  //     if (inputRef.current) {
  //       inputRef.current.removeListener(
  //         "places_changed",
  //         debouncedHandlePlaceChanged
  //       );
  //     }
  //   };
  // }, [debouncedHandlePlaceChanged]);

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
          venueLatitude,
          venueLongitude,
          city,
          state,
          country,
          meetingLink,
          ticketPrice: isFree ? 0 : ticketPrice, // Set ticket price as 0 if it's free
          capacity,
          eventType: selectedCategory,
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
      setCity("");
      setState("");
      setCountry("");
      setVenueLatitude();
      setVenueLongitude();
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

  const handlePrivacyClick = (val) => {
    setIsPrivate(val);
    setIsEventTypeOpen(false);
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
            position={"relative"}
            justifyContent={"center"}
            margin={"auto"}
            onClick={() => imageRef.current.click()}
          >
            <Input
              type="file"
              position={"absolute"}
              hidden
              height={"full"}
              top={0}
              left={0}
              right={0}
              bottom={0}
              ref={imageRef}
              onChange={handleImageChange}
            />
            <FcPicture
              style={{
                marginLeft: "5px",
                cursor: "pointer",
                position: "absolute",
                bottom: 2,
                right: 5,
                borderRadius: "50%",
              }}
              size={50}
            />
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
            <Popover isOpen={isEventTypeOpen}>
              <PopoverTrigger>
                <Button
                  size={"xs"}
                  gap={2}
                  bg="rgba(218, 218, 218, 0.77)"
                  _hover={{ bg: "blue.600", color: "white" }}
                  onClick={() => setIsEventTypeOpen(true)}
                >
                  {isPrivate ? (
                    <>
                      <RiGitRepositoryPrivateFill />
                      Private
                    </>
                  ) : (
                    <>
                      <CiGlobe />
                      Public
                    </>
                  )}
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
                    onClick={() => {
                      handlePrivacyClick(false);
                    }}
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
                    onClick={() => {
                      handlePrivacyClick(true);
                    }}
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
                        min={new Date().toISOString().split("T")[0]}
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
                        min={startDate}
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

            <Flex
              bg={"gray.200"}
              borderRadius={"md"}
              flexDirection={"column"}
              justifyContent={"center"}
            >
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
                <option value="">GMT</option>
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
                  {venue ? (
                    <Text>{venue}</Text>
                  ) : (
                    <Text>Offline location or virtual link</Text>
                  )}
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
                  // <LoadScript
                  //   style={{ width: "100%" }}
                  //   googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY2}
                  //   libraries={libraries}
                  // >
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
                  // </LoadScript>
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
          <Flex
            bg={"gray.200"}
            borderRadius={"md"}
            mt={2}
            flexDir={"column"}
            p={3}
            gap={2}
            w="full"
          >
            <Flex
              flexDir={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Flex alignItems={"center"} gap={2}>
                <CiLocationOn size={20} />
                <Text fontSize={"lg"} fontWeight={500} color={"gray.600"}>
                  Event Category
                </Text>
              </Flex>

              <Select
                maxW={"25%"}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select Event Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </Flex>
          </Flex>
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
              <Text>{postText ? postText : ""}</Text>
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
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={closeEditDescModal}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* EventOptions */}
          <Text fontSize={"lg"} mt={3} fontWeight={500} color={"gray.600"}>
            Event Options
          </Text>

          {/* Tickets */}
          <Flex
            bg={"gray.200"}
            borderRadius={"md"}
            mt={2}
            flexDir={"row"}
            p={2}
            gap={2}
            w="full"
            justifyContent={"space-between"}
          >
            <Flex alignItems={"center"} gap={2}>
              <IoTicketOutline size={20} />
              <Text fontSize={"lg"} fontWeight={400} color={"gray.600"}>
                Tickets
              </Text>
            </Flex>
            <Flex alignItems={"center"} gap={2}>
              <Text fontSize={"lg"} fontWeight={500} color={"gray.400"}>
                Free
              </Text>
              <Popover>
                <PopoverTrigger>
                  <Button size={"sm"}>
                    <CiEdit size={20} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent isCentered>
                  <PopoverArrow />
                  <PopoverHeader fontSize={"xl"}>Accept Payments</PopoverHeader>
                  <PopoverBody>
                    <Text fontSize={"md"}>
                      We use <span color="red">Stripe</span> to process
                      payments. Connect or setup a Stripe account to start
                      accepting payments.it usually takes less than 5 minutes
                    </Text>
                    <Button
                      w={"full"}
                      mt={2}
                      _hover={{ bg: "blue.600", color: "white" }}
                    >
                      Connect Stripe
                    </Button>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>
          </Flex>

          {/* Require Approval */}
          <Flex
            bg={"gray.200"}
            borderRadius={"md"}
            mt={2}
            flexDir={"row"}
            p={2}
            gap={2}
            w="full"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Flex alignItems={"center"} gap={2}>
              <MdOutlineVerifiedUser size={20} />
              <Text fontSize={"lg"} fontWeight={400} color={"gray.600"}>
                Require Approval
              </Text>
            </Flex>
            <Switch
              id="private-settings"
              isChecked={requireApproval}
              onChange={() => setRequireApproval(!requireApproval)}
            />
          </Flex>

          {/* Capacity */}
          <Flex
            bg={"gray.200"}
            borderRadius={"md"}
            mt={2}
            flexDir={"row"}
            p={2}
            gap={2}
            w="full"
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Flex alignItems={"center"} gap={2}>
              <PiSeatbelt size={20} />
              <Text fontSize={"lg"} fontWeight={400} color={"gray.600"}>
                Capacity
              </Text>
            </Flex>
            <Flex alignItems={"center"} gap={2}>
              <Text fontSize={"lg"} fontWeight={500} color={"gray.400"}>
                {isUnlimited ? "Unlimited" : capacity}
              </Text>

              <Button size={"sm"} onClick={onOpenCapcaitySet}>
                {" "}
                <CiEdit size={20} />
              </Button>

              <Modal
                isOpen={isOPenCapacitySet}
                onClose={OnCloseCapacitySet}
                isCentered
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Max Capacity</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    Auto-close registration when the capacity is reached.{" "}
                    <Text fontSize={"lg"} fontWeight={500} color={"gray.600"}>
                      Capacity
                    </Text>
                    <Flex gap={2} alignItems={"center"}>
                      <Switch
                        id="private-settings"
                        isChecked={isUnlimited}
                        onChange={() => setIsUnlimited(!isUnlimited)}
                      />
                      <Text>Unlimited</Text>
                    </Flex>
                    {!isUnlimited && (
                      <Input
                        type="number"
                        mt={2}
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                      />
                    )}
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      colorScheme="purple"
                      mr={3}
                      size={"sm"}
                      onClick={OnCloseCapacitySet}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </Flex>
          </Flex>

          <Button
            colorScheme="purple"
            mt={3}
            p={2}
            size={"lg"}
            onClick={handleCreatePost}
            isLoading={loading}
          >
            Create Event
          </Button>
        </Flex>
      </Grid>
    </>
  );
};
border;

export default CreateEventPage;

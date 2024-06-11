import { AddIcon } from "@chakra-ui/icons";
import {
  Select,
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
  Switch,
  FormLabel,
  Checkbox,
  PopoverTrigger,
  Popover,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";
import { debounce } from "lodash";

const MAX_CHAR = 500;
const MAX_NAME = 100;
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

// const categories = ["Category 1", "Category 2", "Category 3"]; // Define categories array

const CreatePost = ({ date, createPostOpen, setCreatePostOpen }) => {
  const { isOpen, onOpen, onClose: closeCreate } = useDisclosure();
  const [postText, setPostText] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const [remainingName, setRemainingName] = useState(MAX_NAME);
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

  useEffect(() => {
    if (createPostOpen) {
      onOpen();
      setStartDate(date);
    }
  }, [createPostOpen]);

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

  function onCloseCreate() {
    closeCreate();
    setCreatePostOpen(!createPostOpen);
  }

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
  const handleNameChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_NAME) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostName(truncatedText);
      setRemainingName(0);
    } else {
      setPostName(inputText);
      setRemainingName(MAX_NAME - inputText.length);
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
    onCloseCreate();
  };
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={5}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        size={{ base: "sm", sm: "md" }}
      >
        <AddIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onCloseCreate}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Create Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Event Name</FormLabel>
              <Input type="text" value={postName} onChange={handleNameChange} />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingName}/{MAX_NAME}
              </Text>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Post content goes here.."
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
              <FormLabel>Image</FormLabel>

              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
              <FormLabel>Start Time</FormLabel>
              <Input
                type="date"
                w={"60%"}
                value={startDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="time"
                w={"40%"}
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                value={endDate}
                min={startDate}
                w={"60%"}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Input
                type="time"
                value={endTime}
                w={"40%"}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <FormLabel>Time Zone</FormLabel>
              <Select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
              >
                <option value="">Select Time Zone</option>
                {timeZones.map((zone) => (
                  <option key={zone.value} value={zone.value}>
                    {zone.label}
                  </option>
                ))}
              </Select>
              <FormLabel>Event Type</FormLabel>
              <Select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
              >
                <option value="">Select Event Type</option>
                <option value="Physical">Physical</option>
                <option value="Virtual">Virtual</option>
                <option value="Hybrid">Hybrid</option>
              </Select>

              {/* Conditionally render venue input based on event type */}
              {["Physical", "Hybrid"].includes(eventType) && (
                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <LoadScript
                    googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
                    libraries={libraries}
                  >
                    <StandaloneSearchBox
                      onLoad={(ref) => (inputRef.current = ref)}
                      onPlacesChanged={handlePlaceChanged}
                    >
                      <Input
                        type="text"
                        placeholder=""
                        onChange={(e) => setVenue(e.target.value)}
                      />
                    </StandaloneSearchBox>
                  </LoadScript>
                </FormControl>
              )}

              {/* Conditionally render meeting link input based on event type */}
              {["Virtual", "Hybrid"].includes(eventType) && (
                <FormControl isRequired>
                  <FormLabel>Meeting Link</FormLabel>
                  <Input
                    type="text"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                </FormControl>
              )}

              <FormControl>
                <FormLabel>Ticket Price</FormLabel>
                <Popover placement="right">
                  <PopoverTrigger>
                    <Button
                      size={"xs"}
                      bg="rgba(218, 218, 218, 0.68)"
                      _hover={{ bg: "blue.600", color: "white" }}
                    >
                      Free
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverHeader fontSize={"xl"}>
                      Accept Payments
                    </PopoverHeader>
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
                {/* {!isFree && (
                  <Input
                    type="number"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                  />
                )} */}
              </FormControl>

              <FormLabel>Capacity</FormLabel>
              <Checkbox
                isChecked={isUnlimited}
                onChange={(e) => setIsUnlimited(e.target.checked)}
              >
                Unlimited
              </Checkbox>
              {!isUnlimited && (
                <Input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              )}

              <FormLabel>Do you want to make this Event Private?</FormLabel>
              <Switch
                id="private-settings"
                isChecked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
              />
              <Text>
                Note: People with link will only be able to know / join this
                event.
              </Text>
              <FormLabel>Require Approval</FormLabel>
              <Switch
                id="private-settings"
                isChecked={requireApproval}
                onChange={() => setRequireApproval(!requireApproval)}
              />
            </FormControl>
            <FormLabel>Ticket Sales Start Date</FormLabel>
            <Input
              type="date"
              value={ticketSalesStartDate}
              w={"60%"}
              onChange={(e) => setTicketSalesStartDate(e.target.value)}
            />
            <Input
              type="time"
              value={ticketSalesStartTime}
              w={"40%"}
              onChange={(e) => setTicketSalesStartTime(e.target.value)}
            />

            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;

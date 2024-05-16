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
} from "@chakra-ui/react";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";
import { GiTriquetra } from "react-icons/gi";

const MAX_CHAR = 500;
const timeZones = [
  { value: "GMT-12", label: "GMT-12:00" },
  { value: "GMT-11", label: "GMT-11:00" },
  // Add more time zones as needed
];
const categories = ["Category 1", "Category 2", "Category 3"]; // Define categories array
const subcategories = {
  "Category 1": ["Subcategory 1.1", "Subcategory 1.2", "Subcategory 1.3"],
  "Category 2": ["Subcategory 2.1", "Subcategory 2.2", "Subcategory 2.3"],
  "Category 3": ["Subcategory 3.1", "Subcategory 3.2", "Subcategory 3.3"],
}; // Define subcategories object

const CreatePost = ({ date, createPostOpen, setCreatePostOpen }) => {
  const { isOpen, onOpen, onClose: closeCreate } = useDisclosure();
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
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [isFree, setIsFree] = useState(false); // State to manage free ticket price
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [ticketSalesStartDate, setTicketSalesStartDate] = useState("");
  const [ticketSalesStartTime, setTicketSalesStartTime] = useState("");
  const [ticketSalesEndDate, setTicketSalesEndDate] = useState("");
  const [ticketSalesEndTime, setTicketSalesEndTime] = useState("");

  useEffect(() => {
    openCreate();
  }, [createPostOpen]);
  console.log("Create", createPostOpen);

  const openCreate = () => {
    if (createPostOpen) {
      onOpen();
      setStartDate(date);
    }
  };
  function onCloseCreate() {
    closeCreate();
    setCreatePostOpen(false);
  }

  const handlePlaceChanged = () => {
    const [place] = inputRef.current.getPlaces();

    if (place) {
      setSelectedLocation({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        formattedAddress: place.formatted_address,
      });
    }
  };
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
          ticketPrice: isFree ? 0 : ticketPrice, // Set ticket price as 0 if it's free
          capacity,
          eventType,
          category,
          subCategory,
          ticketSalesStartDate,
          ticketSalesStartTime,
          ticketSalesEndDate,
          ticketSalesEndTime,
          isPrivate,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post created successfully", "success");
      onCloseCreate();
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
      setTicketPrice("");
      setCapacity("");
      setEventType("");
      setCategory("");
      setSubCategory("");
      setTicketSalesStartDate("");
      setTicketSalesStartTime("");
      setTicketSalesEndDate("");
      setTicketSalesEndTime("");
      setIsFree(false); // Reset free ticket price state
      setIsPrivate(false); // Reset private post setting state
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
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
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Event Name</FormLabel>
              <Input
                type="text"
                value={postName}
                onChange={(e) => setPostName(e.target.value)}
              />
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Post content goes here.."
                onChange={handleTextChange}
                value={postText}
              />
              <FormLabel>Image</FormLabel>
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

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
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <FormLabel>Start Time</FormLabel>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <FormLabel>End Time</FormLabel>
              <Input
                type="time"
                value={endTime}
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
                <FormControl>
                  <FormLabel>Venue</FormLabel>
                  <Input
                    type="text"
                    placeholder="Venue"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                  />
                  {/* <FormLabel>Venue</FormLabel>
								<LoadScript googleMapsApiKey="YOUR_API_KEY" libraries={["places"]}>
									<StandaloneSearchBox onLoad={ref => (inputRef.current = ref)} onPlacesChanged={handlePlaceChanged}>
										<Input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} />
									</StandaloneSearchBox>
								</LoadScript> */}
                </FormControl>
              )}

              {/* Conditionally render meeting link input based on event type */}
              {["Virtual", "Hybrid"].includes(eventType) && (
                <FormControl>
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
                <Checkbox
                  isChecked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                >
                  Free
                </Checkbox>
                {!isFree && (
                  <Input
                    type="number"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                  />
                )}
              </FormControl>

              <FormLabel>Capacity</FormLabel>
              <Input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />

              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {category && (
                <FormControl>
                  <FormLabel>Sub Category</FormLabel>
                  <Select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                  >
                    <option value="">Select Sub Category</option>
                    {subcategories[category].map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </Select>
                </FormControl>
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
            </FormControl>
            <FormLabel>Ticket Sales Start Date</FormLabel>
            <Input
              type="date"
              value={ticketSalesStartDate}
              onChange={(e) => setTicketSalesStartDate(e.target.value)}
            />
            <FormLabel>Ticket Sales Start Time</FormLabel>
            <Input
              type="time"
              value={ticketSalesStartTime}
              onChange={(e) => setTicketSalesStartTime(e.target.value)}
            />
            <FormLabel>Ticket Sales End Date</FormLabel>
            <Input
              type="date"
              value={ticketSalesEndDate}
              onChange={(e) => setTicketSalesEndDate(e.target.value)}
            />
            <FormLabel>Ticket Sales End Time</FormLabel>
            <Input
              type="time"
              value={ticketSalesEndTime}
              onChange={(e) => setTicketSalesEndTime(e.target.value)}
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

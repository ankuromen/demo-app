import {
  Box,
  Flex,
  Grid,
  Image,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import useShowToast from "../hooks/useShowToast";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { IoDocumentText } from "react-icons/io5";
import { Navigate, useNavigate } from "react-router-dom";

const ChatDetails = ({ setIsActivitiesOpen ,isActivitiesOpen}) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingImages, setLoadingImages] = useState(true);
  const [messages, setMessages] = useState([]);
  const [messagesWithImages, setMessagesWithImages] = useState();
  const [messagesWithImagesView, setMessagesWithImagesView] = useState();
  const [messagesWithEvent, setMessagesWithEvent] = useState();
  const [messagesWithEventView, setMessagesWithEventView] = useState();
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [viewAllEvents, setViewAllEvents] = useState(false);
  const [viewAllImages, setViewAllImages] = useState(false);
  const showToast = useShowToast();
  const Navigate = useNavigate();

  const sortSharedImages = async (messages) => {
    setLoadingImages(true);
    const messagesWithImages = await messages.reverse().filter((message) => {
      return message.img;
    });
    setMessagesWithImages(messagesWithImages);
    setMessagesWithImagesView(messagesWithImages.slice(0, 6));
    setLoadingImages(false);
  };

  const getUser = async (postedBy) => {
    try {
      const res = await fetch("/api/users/profile/" + postedBy);
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      return data;
    } catch (error) {
      showToast("Error", error.message, "error");
      setPostUser(null);
    }
  };
  const sortSharedEvents = async (messages) => {
    const messagesWithEvent = await messages.filter((message) => {
      return message.sharedPost.length > 0;
    });
    setMessagesWithEvent(messagesWithEvent);
    setMessagesWithEventView(messagesWithEvent.slice(0, 3));
    setLoadingEvents(false);
  };
  useEffect(() => {
    const getMessages = async () => {
      setMessages([]);
      try {
        if (selectedConversation.mock) return;
        if (selectedConversation.userId) {
          const res = await fetch(
            `/api/messages/${selectedConversation.userId}`
          );
          const data = await res.json();
          setMessages(data);
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getMessages();
  }, [selectedConversation.userId, selectedConversation.mock]);

  const navigateToEvent = async (event) => {
    console.log(event[0].postedBy);
    try {
      const user = await getUser(event[0].postedBy);
      Navigate(`/${user.username}/post/${event[0]._id}`);
    } catch {
      showToast("", "Something went wrong", "error");
    }
  };

  useEffect(() => {
    sortSharedImages(messages);
    sortSharedEvents(messages);
  }, [messages]);

  return (
    <Flex
      display={{ sm: `${!isActivitiesOpen ? "none" : "flex"}`, lg: "flex" }}
      flex={30}
      gap={2}
      flexDirection={"column"}
      p={3}
      h={"100%"}
      w={"100%"}
      overflowY={"scroll"}
      bg={useColorModeValue("gray.200", "gray.dark")}
    >
      <Flex alignItems={"center"} justifyContent={"space-between"}>
        <Text
          fontSize={"lg"}
          fontWeight={500}
          color={useColorModeValue("gray.800", "white")}
        >
          Details
        </Text>
        <IoCloseOutline size={25} onClick={() => setIsActivitiesOpen(false)} />
      </Flex>

      {/* SharedImages Part*/}
      {!viewAllEvents && (
        <Flex flexDirection={"column"} mt={10}>
          <Flex alignItems={"center"} justifyContent={"space-between"} mb={5}>
            <Text fontSize={"lg"} fontWeight={500}>
              Shared Images
            </Text>
            {viewAllImages ? (
              <IoCloseOutline
                onClick={() => {
                  setViewAllImages(false);
                }}
              />
            ) : (
              <ArrowForwardIcon
                boxSize={4}
                onClick={() => {
                  setViewAllImages(true);
                }}
              />
            )}
          </Flex>
          {loadingImages && <Spinner />}
          {messagesWithImages?.length > 0 && !loadingImages ? (
            <Grid
              gridTemplateColumns={{ base: "1fr 1fr", md: "1fr 1fr 1fr" }}
              w={"100%"}
              gap={3}
              overflow={"auto"}
            >
              {(viewAllImages
                ? messagesWithImages
                : messagesWithImagesView
              ).map((message) => {
                return (
                  <Box
                    key={message._id}
                    h={20}
                    w={"100%"}
                    overflow={"hidden"}
                    rounded={"lg"}
                  >
                    <Image
                      objectFit={"cover"}
                      h={"100%"}
                      w={"100%"}
                      src={message?.img}
                      alt="image"
                    />
                  </Box>
                );
              })}
            </Grid>
          ) : (
            <Text>No Image Found</Text>
          )}
        </Flex>
      )}

      {/* SharedEvents Part*/}
      {!viewAllImages && (
        <Flex flexDirection={"column"} mt={2}>
          <Flex alignItems={"center"} justifyContent={"space-between"} mb={5}>
            <Text fontSize={"lg"} fontWeight={500}>
              Shared Events
            </Text>
            {viewAllEvents ? (
              <IoCloseOutline
                onClick={() => {
                  setViewAllEvents(false);
                }}
              />
            ) : (
              <ArrowForwardIcon
                boxSize={4}
                onClick={() => {
                  setViewAllEvents(true);
                }}
              />
            )}
          </Flex>
          {loadingImages && <Spinner />}
          {messagesWithEvent?.length > 0 && !loadingEvents ? (
            (viewAllEvents ? messagesWithEvent : messagesWithEventView)?.map(
              (message) => {
                return (
                  <Flex
                    key={message.conversationId}
                    h={12}
                    w={"100%"}
                    overflow={"hidden"}
                    rounded={"lg"}
                    alignItems={"center"}
                    p={2}
                    gap={2}
                    cursor={"pointer"}
                    onClick={() => navigateToEvent(message.sharedPost)}
                  >
                    <Flex
                      borderRadius={"full"}
                      bg={useColorModeValue("gray.dark", "white")}
                      h={10}
                      w={10}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <IoDocumentText
                        size={24}
                        color={useColorModeValue("white", "black")}
                      />
                    </Flex>
                    <Text color={useColorModeValue("black", "white")}>
                      {message.sharedPost[0].name}
                    </Text>
                  </Flex>
                );
              }
            )
          ) : (
            <Text>No Events Found</Text>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default ChatDetails;

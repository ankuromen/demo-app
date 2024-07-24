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

const ChatDetails = ({ setIsActivitiesOpen }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingImages, setLoadingImages] = useState(true);
  const [messages, setMessages] = useState([]);
  const [messagesWithImages, setMessagesWithImages] = useState();
  const [messagesWithImagesView, setMessagesWithImagesView] = useState();
  const [messagesWithEvent, setMessagesWithEvent] = useState();
  const [messagesWithEventView, setMessagesWithEventView] = useState();
  const [loadingEvents, setLoadingEvents] = useState(true);
  const showToast = useShowToast();

  const sortSharedImages = async (messages) => {
    const messagesWithImages = await messages.reverse().filter((message) => {
      return message.img;
    });
    setMessagesWithImages(messagesWithImages);
    setMessagesWithImagesView(messagesWithImages.slice(0, 6));
    setLoadingImages(false);
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

  useEffect(() => {
    sortSharedImages(messages);
    sortSharedEvents(messages);
  }, [messages]);

  return (
    <Flex
      flex={30}
      gap={2}
      flexDirection={"column"}
      p={3}
      h={"100%"}
      w={"100%"}
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
      <Flex flexDirection={"column"} mt={10}>
        <Flex alignItems={"center"} justifyContent={"space-between"} mb={5}>
          <Text fontSize={"lg"} fontWeight={500}>
            Shared Images
          </Text>
          <ArrowForwardIcon boxSize={4} />
        </Flex>
        {loadingImages && <Spinner />}
        {messagesWithImagesView?.length > 0 && !loadingImages ? (
          <Grid
            gridTemplateColumns={{ base: "1fr 1fr", md: "1fr 1fr 1fr" }}
            w={"100%"}
            gap={3}
          >
            {messagesWithImagesView &&
              messagesWithImagesView.map((message) => {
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
      {/* SharedEvents Part*/}
      <Flex flexDirection={"column"}>
        <Flex alignItems={"center"} justifyContent={"space-between"} mb={5}>
          <Text fontSize={"lg"} fontWeight={500}>
            Shared Events
          </Text>
          <ArrowForwardIcon boxSize={4} />
        </Flex>
        {loadingImages && <Spinner />}
        {messagesWithEventView?.length > 0 && !loadingEvents ? (
          messagesWithEventView?.map((message) => {
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
          })
        ) : (
          <Text>No Events Found</Text>
        )}
      </Flex>
    </Flex>
  );
};

export default ChatDetails;

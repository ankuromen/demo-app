import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import { IoIosSearch } from "react-icons/io";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext.jsx";
import messageSound from "../assets/sounds/message.mp3";
import { MdOutlineMenuOpen } from "react-icons/md";
const MessageContainer = ({ post, isActivitiesOpen, setIsActivitiesOpen }) => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }

      // make a sound if the window is not focused
      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }

      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => socket.off("newMessage");
  }, [socket, selectedConversation, setConversations]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser?._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (selectedConversation.mock) return;
        if (selectedConversation.userId) {
          const res = await fetch(
            `/api/messages/${selectedConversation.userId}`
          );
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          setMessages(data);
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [showToast, selectedConversation.userId, selectedConversation.mock]);

  return (
    <Flex
      flex="70"
      h={"80vh"}
      borderRadius={"md"}
      flexDirection={"column"}
      borderStart={"0.1px solid"}
      borderEnd={"0.1px solid"}
      borderEndColor={useColorModeValue("gray.200", "gray.600")}
      borderStartColor={useColorModeValue("gray.200", "gray.600")}
    >
      {/* Message header */}
      <Flex
        w={"full"}
        h={12}
        alignItems={"center"}
        justifyContent={"space-between"}
        gap={2}
        pt={10}
        pb={10}
        ps={3}
        bg={useColorModeValue("gray.200", "gray.dark")}
      >
        <Flex alignItems={"center"} gap={2}>
          <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
          <Text display={"flex"} alignItems={"center"} fontSize={"xl"}>
            {selectedConversation.username}{" "}
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Text>
        </Flex>
        <Flex alignItems={"center"} me={2}>
          <Button
            bg={useColorModeValue("black", "white")}
            _hover={{
              bg: useColorModeValue("black", "white"),
            }}
            rounded="full"
            me={5}
          >
            <IoIosSearch color={useColorModeValue("white", "black")} />
          </Button>
          {!isActivitiesOpen && (
            <MdOutlineMenuOpen
              size={30}
              color="gray.500"
              onClick={() => setIsActivitiesOpen(true)}
            />
          )}
        </Flex>
      </Flex>

      <Divider />

      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        p={2}
        overflowY={"auto"}
        flex={1}
      >
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}

        {!loadingMessages &&
          messages.map((message) => (
            <Flex
              key={message._id}
              direction={"column"}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? messageEndRef
                  : null
              }
            >
              <Message
                message={message}
                ownMessage={currentUser._id === message?.sender}
              />
            </Flex>
          ))}
      </Flex>

      <MessageInput setMessages={setMessages} post={post} />
    </Flex>
  );
};

export default MessageContainer;

import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import { useLocation } from "react-router-dom";
import ChatDetails from "../components/ChatDetails";

const ChatPage = () => {
  const [searchingUser, setSearchingUser] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  const location = useLocation();
  const sharingPost = location?.state?.post;
  const contactUser = location?.state?.user;
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);
  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === conversationId) {
            return {
              ...conversation,
              lastMessage: {
                ...conversation.lastMessage,
                seen: true,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });
  }, [socket, setConversations]);

  const selectedContactload = async () => {
    if (contactUser && contactUser?._id !== currentUser?._id) {
      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === contactUser._id
      );

      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: contactUser._id,
          username: contactUser.username,
          userProfilePic: contactUser.profilePic,
        });
        return;
      } else {
        const newConversation = {
          _id: Date.now(),
          userId: contactUser._id,
          username: contactUser.username,
          userProfilePic: contactUser.profilePic,
          participants: [
            {
              _id: contactUser._id,
              username: contactUser.username,
              profilePic: contactUser.profilePic,
            },
          ],
        };
        setConversations((prevConvs) => [...prevConvs, newConversation]);
      }
    }
  };

  useEffect(() => {
    selectedContactload();
  }, [contactUser, conversations, currentUser, setSelectedConversation]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [showToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Error", searchedUser.error, "error");
        return;
      }

      const messagingYourself = searchedUser._id === currentUser._id;
      if (messagingYourself) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );

      if (conversationAlreadyExists) {
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      w={{ base: "100%", md: "100%", lg: "100%" }}
      h={"100%"}
      transform={"translateX(-50%)"}
    >
      <Grid
        gridTemplateColumns={{ md: `1fr 2fr ${isActivitiesOpen ? "1fr" : ""}` }}
        height={"80vh"}
        mx={"auto"}
      >
        {/* Contacts Area */}
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          p={3}
          overflowY={"auto"}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
          mx={"auto"}
          w={"100%"}
        >
          <Text
            fontSize={"3xl"}
            fontWeight={500}
            color={useColorModeValue("gray.800", "white")}
          >
            Messages
          </Text>

          <HStack mt={4}>
            <Button
              w={"50%"}
              bg={"red.500"}
              _hover={{
                bg: "red.600",
              }}
              borderRadius={30}
            >
              Connections
            </Button>
            <Button w={"50%"} borderRadius={30}>
              Communities
            </Button>
          </HStack>

          <form onSubmit={handleConversationSearch}>
            <Flex
              alignItems={"center"}
              gap={2}
              borderBottom={"0.1px solid"}
              borderBottomColor={useColorModeValue("gray.200", "gray.800")}
              pb={5}
              mt={4}
            >
              <Input
                placeholder="Search for a user"
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button
                size={"sm"}
                onClick={handleConversationSearch}
                isLoading={searchingUser}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!loadingConversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(
                  conversation.participants[0]?._id
                )}
                conversation={conversation}
              />
            ))}
        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to start messaging</Text>
          </Flex>
        )}

        {/* Conversation Area */}
        {selectedConversation._id && (
          <MessageContainer
            post={sharingPost}
            isActivitiesOpen={isActivitiesOpen}
            setIsActivitiesOpen={setIsActivitiesOpen}
          />
        )}

        {/* Shared Area */}
        {isActivitiesOpen && (
          <ChatDetails setIsActivitiesOpen={setIsActivitiesOpen} />
        )}
      </Grid>
    </Box>
  );
};

export default ChatPage;

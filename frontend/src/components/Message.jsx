import { Avatar, Box, Flex, Image, Skeleton, Text, useColorModeValue } from "@chakra-ui/react";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();

  const openEventPage = async (post) => {
    const res = await fetch(`/api/posts/${post._id}`);
    if (res.ok) {
      const data = await res.json();
      navigate(`/${data.postedBy.name}/post/${post._id}`);
    } else {
      console.log("HTTP-Error: " + res.status);
    }
  };

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} flexDirection={"column"}>
          {message.sharedPost?.map((post) => (
            <Box
              key={post._id}
              borderRadius={"lg"}
              overflow={"hidden"}
              maxW={"50%"}
              bg={useColorModeValue("gray.200", "gray.dark")}
              onClick={() => openEventPage(post)}
            >
              {post.img && (
                <Image
                  mt={5}
                  ms={"auto"}
                  me={"auto"}
                  borderRadius={10}
                  maxH={"150px"}
                  src={post.img}
                  alt={"image"}
                />
              )}

              <Box p={"6"}>
                <Box mt={"1"} fontWeight={"semibold"} as={"h4"}>
                  Event Name : {post.name}
                  <br />
                  Venue : {post.venue}
                  <br />
                  Ticket Price : {post.ticketPrice}
                </Box>

                <Box>{post.price}</Box>
              </Box>
            </Box>
          ))}
          {message.text && (
            <Flex
              bg={useColorModeValue("gray.200", "gray.dark")}
              maxW={"350px"}
              w={"fit-content"}
              p={2}
              borderRadius={"md"}
            >
              <Text
                style={{
                  wordWrap: "break-word",
                  maxWidth: "300px",
                  whiteSpace: "pre-line",
                }}
              >
                {message.text}
              </Text>
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="Message image"
                borderRadius={4}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}

          {message.img && imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="Message image" borderRadius={4} />
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}
          {/* 
          <Avatar src={user.profilePic} w="7" h={7} /> */}
        </Flex>
      ) : (
        <Flex gap={2} flexDirection={"column"} alignSelf={"flex-end"}>
          {/* <Avatar src={selectedConversation.userProfilePic} w="7" h={7} /> */}
          {message.sharedPost?.map((post) => (
            <Box
              key={post._id}
              borderRadius={"lg"}
              overflow={"hidden"}
              bg={useColorModeValue("gray.200", "gray.dark")}
              onClick={() => openEventPage(post)}
            >
              {post.img && (
                <Image
                  mt={5}
                  ms={"auto"}
                  me={"auto"}
                  borderRadius={10}
                  maxH={"150px"}
                  src={post.img}
                  alt={"image"}
                />
              )}

              <Box p={"6"}>
                <Box mt={"1"} fontWeight={"semibold"} as={"h4"}>
                  Event Name : {post.name}
                  <br />
                  Venue : {post.venue}
                  <br />
                  Ticket Price : {post.ticketPrice}
                </Box>

                <Box>{post.price}</Box>
              </Box>
            </Box>
          ))}

          {message.text && (
            <Text
              bg={useColorModeValue("gray.200", "gray.dark")}
              p={1}
              maxW={"330px"}
              w={"fit-content"}
              borderRadius={"md"}
            >
              {message.text}
            </Text>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="Message image"
                borderRadius={4}
              />
              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}

          {message.img && imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="Message image" borderRadius={4} />
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};

export default Message;

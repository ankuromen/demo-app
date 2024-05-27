import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text, Stack } from "@chakra-ui/layout";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon, TimeIcon } from "@chakra-ui/icons";
import { FaExpand } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import React from "react";

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };

    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user) return null;
  return (
    <>
      <Link to={`/${user.username}/post/${post._id}`}>
        <Stack
          borderTop={"1px"}
          borderBottom={"1px"}
          borderColor={"gray.300"}
          padding={2}
          w={"80%"}
          m={"auto"}
        >
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Flex>
              <Text fontWeight={"medium"}>
                {new Date(post.startDate).getDate()}&nbsp;
                {new Date(post.startDate).toLocaleDateString([], {
                  month: "long",
                })}
              </Text>
              <Text fontWeight={"small"} color={"gray.500"}>
                &nbsp;/&nbsp;
                {new Date(post.startDate).toLocaleDateString([], {
                  weekday: "long",
                })}
              </Text>
            </Flex>
            {currentUser?._id === user._id && (
              <DeleteIcon size={20} onClick={handleDeletePost} />
            )}
          </Flex>

          <Flex
            flex={""}
            overflow={"hidden"}
            paddingTop={"0.5em"}
            paddingBottom={"0.5em"}
            gap={5}
          >
            {post.img && (
              <Box
                overflow={"hidden"}
                borderRadius={5}
                w={"10em"}
                h={"fit-content"}
              >
                <Image src={post.img} />
              </Box>
            )}
            <Flex flexDirection={"column"} flexGrow={1}>
              <Flex alignItems={"center"} gap={1}>
                <Avatar
                  size="2xs"
                  name={user.name}
                  src={user?.profilePic}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${user.username}`);
                  }}
                />
                <Text fontSize={"xs"}>{user.name}</Text>
              </Flex>
              <Text fontWeight={"medium"} fontSize={"xl"}>
                {post.name}
              </Text>
              <Flex flexGrow={1} justifyContent={"space-between"}>
                <Flex alignItems={"center"}>
                  <TimeIcon color="gray.400" size="sm" />
                  {post.startTime}
                </Flex>
                <Flex alignItems={"center"}>
                  <CiLocationOn size={18} />
                  {post.venue}
                </Flex>
              </Flex>
              <Actions post={post} />
            </Flex>
          </Flex>
        </Stack>
      </Link>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={{ sm: "full", lg: "md" }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <FaExpand size={20} />
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          {/* <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter> */}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Post;

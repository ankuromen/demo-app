import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useToast } from "@chakra-ui/react";
import { BsGlobe2, BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { AtSignIcon } from "@chakra-ui/icons";
import { AiFillCompass, AiTwotoneHeart } from "react-icons/ai";
import { FaLinkedinIn, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { RxDotsHorizontal } from "react-icons/rx";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom); // logged in user
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  const Navigate = useNavigate();

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: "Success.",
        status: "success",
        description: "Profile link copied.",
        duration: 3000,
        isClosable: true,
      });
    });
  };
  return (
    <VStack gap={4} alignItems={"start"} w={"80%"} mt={10} mx={"auto"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"}>{user.name}</Text>
          <Flex gap={2} alignItems={"center"}>
            <AtSignIcon />
            <Text fontSize={"sm"}>{user.username}</Text>
            {/* <EmailIcon />
            <Text fontSize={"sm"}>{user.email}</Text> */}
            {/* <InfoIcon />
            <Text fontSize={"sm"}>{user.occupation}</Text> */}
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            {user.location && (
              <>
                <AiFillCompass />
                <Text fontSize={"sm"}>{user.location}</Text>
              </>
            )}
            {/* <AiFillFlag />
            <Text fontSize={"sm"}>{user.nationality}</Text> */}
          </Flex>
          <Flex gap={2} alignItems={"center"}>
            <AiTwotoneHeart />
            <Text fontSize={"sm"}>{user.interests.join(", ")}</Text>
          </Flex>

          <Box borderRadius={"md"} w="100%" borderColor={"gray.200"}>
            <Text fontSize={"sm"} fontStyle={"italic"}>
              {" "}
              {user.bio}
            </Text>
          </Box>
        </Box>
        <Flex flexDir={"column"}>
          {user.profilePic && (
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          )}
          <Menu>
            <MenuButton marginLeft={"auto"} mr={4} mt={3}>
              <RxDotsHorizontal />
            </MenuButton>
            <MenuList>
              <MenuItem>
                {currentUser?._id === user._id && (
                  <Link
                    as={RouterLink}
                    to="/update"
                    textDecoration={"none"}
                    fontWeight={"500"}
                  >
                    Update Profile
                  </Link>
                )}
              </MenuItem>
              <MenuItem onClick={copyURL} fontWeight={"500"}>
                Copy link
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      {currentUser?._id !== user._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <Link href={user.linkedin} isExternal>
              <FaLinkedinIn size={24} />
            </Link>
          </Box>
          <Box className="icon-container">
            <Link href={user.twitter} isExternal>
              <FaXTwitter size={24} />
            </Link>
          </Box>
          <Box className="icon-container">
            <Link
              href={`https://www.instagram.com/${user.instagram}`}
              isExternal
            >
              <BsInstagram size={24} cursor={"pointer"} />
            </Link>
          </Box>
          <Box className="icon-container">
            <Link href={user.tiktok} isExternal>
              <FaTiktok size={24} cursor={"pointer"} />
            </Link>
          </Box>
          <Box className="icon-container">
            <Link href={user.youtube} isExternal>
              <FaYoutube size={24} cursor={"pointer"} />
            </Link>
          </Box>
          <Box className="icon-container">
            <Link href={user.website} isExternal>
              <BsGlobe2 size={24} cursor={"pointer"} />
            </Link>
          </Box>
          {/* <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box> */}
        </Flex>
      </Flex>
      {currentUser?._id === user._id && (
        <Flex w={"full"} justifyContent="space-between">
          {/* Create Campaign button */}
          <Button size={"sm"}>Create Campaign</Button>

          {/* Create Story button */}
          <Button size={"sm"} onClick={() => Navigate("/create")}>
            Create Event
          </Button>

          {/* Create Story button */}
          <Button size={"sm"}>Create Story</Button>

          {/* Create Broadcast button */}
          <Button size={"sm"}>Create Broadcast</Button>
        </Flex>
      )}

      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid"}
          borderColor={"gray.500"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}  
        >
          {currentUser?._id === user._id ? (
            <Text fontWeight={"bold"}> Your Events</Text>
          ) : (
            <Text fontWeight={"bold"}> User Events</Text>
          )}
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;

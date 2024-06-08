import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { SlLocationPin } from "react-icons/sl";
import { MdOutlineEventAvailable } from "react-icons/md";
import postsAtom from "../atoms/postsAtom";
import JoinEvent from "../components/JoinEvent";

const PostPage = (post) => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!currentPost) return null;

  console.log("currentPost", currentPost);

  return (
    <>
      <Grid
        gridTemplateColumns={{ base: "1fr", md: "1fr 2fr" }}
        maxW={{ base: "95%", lg: "60%" }}
        margin={"auto"}
        alignItems={"start"}
      >
        {/* left side */}

        <Flex w="100%" direction={"column"} p={3}>
          {currentPost.img && (
            <Box
              borderRadius={15}
              overflow={"hidden"}
              w={{ base: "full", md: 320 }}
              h={310}
              alignItems={"center"}
              justifyContent={"center"}
              margin={"auto"}
            >
              <Image src={currentPost.img} w={"full"} h={"full"} />
            </Box>
          )}
          <Box display={{ base: "none", lg: "block" }}>
            <Text
              color={"gray.500"}
              pt={5}
              pb={2}
              fontSize={"sm"}
              fontWeight={"500"}
              borderBottom={"1px solid"}
              borderBottomColor={"gray.300"}
            >
              Hosted By
            </Text>
            <Flex gap={3} pt={2} align={"center"}>
              <Avatar
                src={user.profilePic}
                size={"xs"}
                name="Mark Zuckerberg"
              />
              <Text fontSize={20} fontWeight={"500"} color={"gray.600"}>
                {user.username}
              </Text>
            </Flex>
          </Box>
          <Box pb={5} display={{ base: "none", lg: "block" }}>
            <Text
              color={"gray.500"}
              pt={5}
              pb={2}
              fontSize={"sm"}
              fontWeight={"500"}
              borderBottom={"1px solid"}
              borderBottomColor={"gray.300"}
            >
              72 Going
            </Text>
            <Flex pt={2}>
              <Avatar
                src={user.profilePic}
                size={"xs"}
                name="Mark Zuckerberg"
              />
              <Avatar
                src={user.profilePic}
                size={"xs"}
                name="Mark Zuckerberg"
                ms={-2}
              />
              <Avatar
                src={user.profilePic}
                size={"xs"}
                name="Mark Zuckerberg"
                ms={-2}
              />
            </Flex>
            <Text fontSize={"xs"} color={"gray.400"}>
              Alejandro, Azia To and 70 others
            </Text>
          </Box>
          <Box display={{ base: "none", lg: "block" }}>
            <Text
              pt={2}
              fontWeight={500}
              color={"gray.400"}
              transition={"ease-in-out 0.5s"}
              _hover={{
                color: "gray.500",
              }}
            >
              Contact the Host
            </Text>
            <Text
              pt={2}
              fontWeight={500}
              color={"gray.400"}
              transition={"ease-in-out 0.5s"}
              _hover={{
                color: "gray.500",
              }}
            >
              Report Event
            </Text>
          </Box>
        </Flex>

        {/* Right side */}

        <Flex w="100%" ps={3} direction={"column"}>
          <Text
            fontSize={{ base: "35", md: 48 }}
            color={"gray.700"}
            fontWeight={600}
            wordBreak={"break-word"}
          >
            {currentPost.name}
          </Text>
          <Flex
            flexDirection={{ base: "row", md: "column" }}
            gap={{ base: 5, md: "none" }}
          >
            {" "}
            <Flex gap={5} color={"gray.600"} pt={1}>
              <Box
                w={"2.5em"}
                h={"2.5em"}
                borderRadius={8}
                border={"1px solid"}
                borderColor={"gray.300"}
                overflow={"hidden"}
                color={"gray.600"}
              >
                <Text
                  fontSize={"2xs"}
                  fontWeight={"bold"}
                  h={"fit-content"}
                  bg={"gray.300"}
                  textAlign={"center"}
                >
                  {new Date(currentPost.startDate).toLocaleDateString([], {
                    month: "long",
                  })}
                </Text>
                <Text textAlign={"center"} fontSize={15} fontWeight={"bold"}>
                  {new Date(currentPost.startDate).getDate()}
                </Text>
              </Box>
              <Box>
                <Text fontWeight={"500"} fontSize={18}>
                  {new Date(currentPost.startDate).toLocaleDateString([], {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
                <Text fontSize={15}>6:00 PM - 8:00 PM EDT</Text>
              </Box>
            </Flex>
            <Flex gap={5} color={"gray.600"} pt={1}>
              <Box
                w={"2.5em"}
                h={"2.5em"}
                borderRadius={8}
                border={"1px solid"}
                borderColor={"gray.300"}
                overflow={"hidden"}
                color={"gray.600"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <SlLocationPin size={25} />
              </Box>
              <Box>
                <Text fontWeight={"500"} fontSize={18}>
                  {currentPost.venue}
                </Text>
                <Text fontSize={15}></Text>
              </Box>
            </Flex>
          </Flex>

          {/* Registration */}

          <Box
            border={"2px solid"}
            borderColor={"gray.200"}
            borderRadius={10}
            mt={10}
            overflow={"hidden"}
          >
            <Text
              bg={"gray.200"}
              ps={2}
              pt={1}
              pb={1}
              color={"gray.500"}
              fontWeight={"500"}
            >
              Registration
            </Text>

            <Box p={4}>
              <Flex
                alignItems={"center"}
                p={1}
                borderBottom={"1px solid"}
                w={"full"}
                borderColor={"gray.200"}
              >
                <MdOutlineEventAvailable size={25} />
                <Box ps={3}>
                  <Text color={"gray.500"} fontWeight={"500"}>
                    Event Full
                  </Text>
                  <Text color={"gray.500"}>
                    If you’d like, you can join the waitlist.
                  </Text>
                </Box>
              </Flex>
              <Text color={"gray.600"} fontWeight={"500"} p={4}>
                Please click on the button below to join the waitlist. You will
                be notified if additional spots become available.
              </Text>
              <Button
                colorScheme="purple"
                variant="solid"
                w={"full"}
                letterSpacing={1}
                onClick={() => setJoinModalOpen(true)}
              >
                Join Waitlist
              </Button>
            </Box>
          </Box>
          {joinModalOpen && (
            <JoinEvent
              user={currentUser}
              post={currentPost}
              joinModalOpen={joinModalOpen}
              setJoinModalOpen={setJoinModalOpen}
            />
          )}
          {/* event details */}

          <Box>
            <Text
              color={"gray.500"}
              pt={5}
              pb={2}
              fontSize={"sm"}
              fontWeight={"500"}
              borderBottom={"1px solid"}
              borderBottomColor={"gray.300"}
            >
              About Event
            </Text>

            <Text
              color={"gray.700"}
              fontSize={"2xl"}
              pt={5}
              pb={2}
              fontWeight={"500"}
            >
              ​What to Expect
            </Text>
            <Text color={"gray.600"} pb={3} fontWeight={400} fontSize={17}>
              ​​​Have you been interested in trying Pickleball? Wondering what
              all the hype is about? Join us for our next TMI Club event in
              partnership with Fairgrounds!
            </Text>
            <Text color={"gray.600"} pb={3} fontWeight={400} fontSize={17}>
              ​Come out for 2 hours of free play followed by prebiotic sodas
              from Geez Louise and goodie bags of other treats! The music will
              be pumping and all skills levels are welcome. Come out for the
              opportunity to try pickleball, get some exercise, and meet new
              people.
            </Text>
            <Text
              color={"gray.700"}
              fontSize={"2xl"}
              pt={5}
              pb={2}
              fontWeight={"500"}
            >
              ​Schedule
            </Text>
            <Text color={"gray.600"} pb={3} fontWeight={400} fontSize={17}>
              ​​​This will be drop-in free play across the 9 courts plus
              opportunities to hang out in the lounge and enjoy prebiotic sodas
              from Geez Louise!
            </Text>
          </Box>

          {/* Location */}

          <Box>
            <Text
              color={"gray.500"}
              pt={5}
              pb={2}
              fontSize={"sm"}
              fontWeight={"500"}
              borderBottom={"1px solid"}
              borderBottomColor={"gray.300"}
            >
              Location
            </Text>
            <Text color={"gray.600"} pb={3} fontWeight={400} fontSize={25}>
              {currentPost.venue}
            </Text>
            <Box borderRadius={10} overflow={"hidden"} mt={2} mb={4}>
              <iframe
                className="Location"
                title="location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2800.311159147775!2d-75.68934432245015!3d45.423228571073366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cce05071ad36a51%3A0x67afbd9897dba9de!2s50%20Laurier%20Ave%20E%2C%20Ottawa%2C%20ON%20K1N%201H7%2C%20Canada!5e0!3m2!1sen!2sin!4v1713060247916!5m2!1sen!2sin"
                width="100%"
                height="300"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Box>
          <Box display={{ base: "block", lg: "none" }}>
            <Text
              color={"gray.500"}
              pt={5}
              pb={2}
              fontSize={"sm"}
              fontWeight={"500"}
              borderBottom={"1px solid"}
              borderBottomColor={"gray.300"}
            >
              Hosted By
            </Text>
            <Flex gap={3} pt={2} align={"center"}>
              <Avatar
                src={user.profilePic}
                size={"xs"}
                name="Mark Zuckerberg"
              />
              <Text fontSize={20} fontWeight={"500"} color={"gray.600"}>
                {user.username}
              </Text>
            </Flex>
          </Box>
          <Box pb={5} display={{ base: "block", lg: "none" }}>
            <Text
              color={"gray.500"}
              pt={5}
              pb={2}
              fontSize={"sm"}
              fontWeight={"500"}
              borderBottom={"1px solid"}
              borderBottomColor={"gray.300"}
            >
              72 Going
            </Text>
            <Flex pt={2}>
              <Avatar
                src={user.profilePic}
                size={"xs"}
                name="Mark Zuckerberg"
              />
              <Avatar
                src={user.profilePic}
                size={"xs"}
                name="Mark Zuckerberg"
                ms={-2}
              />
              <Avatar
                src={user.profilePic}
                size={"xs"}
                name="Mark Zuckerberg"
                ms={-2}
              />
            </Flex>
            <Text fontSize={"xs"} color={"gray.400"}>
              Alejandro, Azia To and 70 others
            </Text>
          </Box>
          <Box display={{ base: "block", lg: "none" }}>
            <Text
              pt={2}
              fontWeight={500}
              color={"gray.400"}
              transition={"ease-in-out 0.5s"}
              _hover={{
                color: "gray.500",
              }}
            >
              Contact the Host
            </Text>
            <Text
              pt={2}
              fontWeight={500}
              color={"gray.400"}
              transition={"ease-in-out 0.5s"}
              _hover={{
                color: "gray.500",
              }}
            >
              Report Event
            </Text>
          </Box>
          {currentUser?._id === user._id && (
            <Button
              colorScheme="red"
              cursor={"pointer"}
              onClick={handleDeletePost}
            >
              Delete Event
            </Button>
          )}
        </Flex>
      </Grid>
    </>
  );
};

export default PostPage;

import { Box, Flex, Text, useMediaQuery } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const EventsCard = ({ post }) => {
  const [isSmallScreen] = useMediaQuery("(max-width: 768px)");
  const [isMediumScreen] = useMediaQuery(
    "(min-width: 769px) and (max-width: 1024px)"
  );
  const showToast = useShowToast();
  const Navigate = useNavigate();
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
    }
  };
  const navigateToEvent = async (event) => {
    try {
      const user = await getUser(event.postedBy);
      Navigate(`/${user.username}/post/${event._id}`);
    } catch {
      showToast("", "Something went wrong", "error");
    }
  };
  console.log("isSmallScreen", isSmallScreen);
  console.log("isMediumScreen", isMediumScreen);

  return (
    <>
      {post && (
        <Flex
          backgroundRepeat="no-repeat"
          h={"35vh"}
          bg={!post.img ? "gray.700" : `url(${post.img})`}
          alignItems={"flex-end"}
          backgroundSize={"cover"}
          backgroundPosition={"center"}
          onClick={() => navigateToEvent(post)}
          borderRadius={"10"}
        >
          <Box
            position={"absolute"}
            color={"gray.200"}
            ps={4}
            pb={4}
            fontSize={"small"}
          >
            <Text
              style={{
                wordWrap: "break-word",
                maxWidth: isSmallScreen ? "100px" : "200px",
                whiteSpace: "pre-line",
              }}
            >
              {post.name}
            </Text>
            <Text>{post.eventType}</Text>

            <Text fontWeight={"medium"}>
              {new Date(post.startDate).getDate()}&nbsp;
              {new Date(post.startDate).toLocaleDateString([], {
                month: "long",
              })}
            </Text>
            <Text>{post.city}</Text>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default EventsCard;

import { Box, Flex, Image, Text, useMediaQuery } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const EventsCard = ({ post }) => {
  const [isSmallScreen] = useMediaQuery("(max-width: 768px)");
  const [isMediumScreen] = useMediaQuery(
    "(min-width: 768px) and (max-width: 1024px)"
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

  return (
    <>
      {post && (
        <Flex
          backgroundRepeat="repeat"
          aspectRatio={
            isMediumScreen ? "16/15" : isSmallScreen ? "16/16" : "16/12"
          }
          bg={!post.img && "gray.700"}
          alignItems={"flex-end"}
          backgroundSize={"cover"}
          backgroundPosition={"center"}
          backgroundAttachment={"local"}
          onClick={() => navigateToEvent(post)}
          borderRadius={"10"}
          overflow={"hidden"}
        >
          {post.img && (
            <Image
              src={post.img && `${post.img}`}
              w={"100%"}
              h={"100%"}
              style={{
                filter: "brightness(0.8)",
              }}
            />
          )}

          <Box
            position={"absolute"}
            color={"gray.200"}
            ps={4}
            pb={4}
            fontSize={"smaller"}
          >
            <Text
              style={{
                wordWrap: "break-word",
                maxWidth: isSmallScreen
                  ? "100px"
                  : isMediumScreen
                  ? "150px"
                  : "200px",
                whiteSpace: "pre-line",
              }}
              fontSize={isMediumScreen || isSmallScreen ? "small" : "medium"}
              fontWeight={"500"}
            >
              {post.name}
            </Text>
            <Text
              fontSize={isMediumScreen || isSmallScreen ? "smaller" : "small"}
            >
              {post.eventType}
            </Text>

            <Text
              fontWeight={"medium"}
              fontSize={isMediumScreen || isSmallScreen ? "smaller" : "small"}
            >
              {new Date(post.startDate).getDate()}&nbsp;
              {new Date(post.startDate).toLocaleDateString([], {
                month: "long",
              })}
            </Text>
            <Text
              fontSize={isMediumScreen || isSmallScreen ? "smaller" : "small"}
            >
              {post.city}
            </Text>
          </Box>
        </Flex>
      )}
    </>
  );
};

export default EventsCard;

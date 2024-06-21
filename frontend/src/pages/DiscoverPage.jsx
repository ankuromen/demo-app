import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import Post from "../components/Post";
import useShowToast from "../hooks/useShowToast";

const DiscoverPage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const [user] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getAllEvents = async () => {
      try {
        setLoading(true);
        setPosts([]);
        const { data } = await axios.get("/api/posts/all");
        setPosts(data);
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false)
      }
    };
    getAllEvents();
  }, []);
  return (
    <Flex gap="10" alignItems="flex-start">
      <Box flex={70}>
        {!loading && posts.length === 0 && (
          <Text fontSize="xl" fontWeight="bold">
            Follow some users to see the feed
          </Text>
        )}

        {loading && (
          <Flex justify="center">
            <Spinner size="xl" />
          </Flex>
        )}

        {!loading &&
          posts?.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
      </Box>
    </Flex>
  );
};

export default DiscoverPage;

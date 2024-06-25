import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Box, Flex, Spinner, Text } from "@chakra-ui/react"; // Import Chakra UI components
import Post from "../components/Post";
import useShowToast from "../hooks/useShowToast";
import SearchBar from "../components/SearchBar";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";

const DiscoverPage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const [user] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);

  const handleSearch = (searchData) => {
    const { filters } = searchData;
    // Assuming you want to format and display search results
    let response = `
      Event Category: ${filters.category}
      Event Location: ${filters.location}
      Event Date Indicator: ${filters.date}
      Event Hoster Indicator: ${filters.eventHoster}
    `;

    setResults(response);
  };

  useEffect(() => {
    const getAllEvents = async () => {
      try {
        setLoading(true);
        setPosts([]); // Clear posts before fetching
        const { data } = await axios.get("/api/posts/all");
        setPosts(data);
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getAllEvents();
  }, [setPosts, showToast]);

  return (
    <Box mx="auto" width="80%" textAlign="center">
      <SearchBar onSearch={handleSearch} />
      {results && (
        <Box p={4} bg="gray.100" mb={4} borderRadius="md">
          <pre>{results}</pre>
        </Box>
      )}

      {!loading && posts.length === 0 && (
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Follow some users to see the feed
        </Text>
      )}

      {loading && (
        <Box textAlign="center" mt={4}>
          <Spinner size="xl" />
        </Box>
      )}

      {!loading &&
        posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
    </Box>
  );
};

export default DiscoverPage;

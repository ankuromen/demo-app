import {
  Box,
  Flex,
  Spinner,
  Input,
  List,
  ListItem,
  Text,
  useColorMode,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Link } from "react-router-dom";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import Post from "../components/Post";
import SuggestedUsers from "../components/SuggestedUsers";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [user] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUsersResults, setSearchUsersResults] = useState([]);
  const [searchPostsResults, setSearchPostsResults] = useState([]);
  const { colorMode } = useColorMode(); // Access the current color mode

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        const userId = user._id;
        const filteredPosts = data.filter(
          (post) => post.postedBy === userId || !post.isPrivate
        );
        setPosts(filteredPosts);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts, user._id]);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    try {
      try {
        const responseUsers = await axios.get(`/api/users/search?q=${query}`);
        setSearchUsersResults(responseUsers.data);
      } catch (error) {
        console.error("Error fetching user search results:", error);
      }
      try {
        const responsePosts = await axios.get(`/api/posts/search/${query}`);
        setSearchPostsResults(responsePosts.data);
      } catch (error) {
        console.error("Error fetching posts search results:", error);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <Flex direction="column" w="80%" m="auto" mt={6}>
      {/* Search bar */}
      <Input
        placeholder="Search users by name or username"
        value={searchQuery}
        onChange={handleSearchChange}
        mb={4}
        size="sm"
      />

      {/* Search results predictions */}
      {(searchUsersResults.length > 0 || searchPostsResults.length > 0) && (
        <Box
          mt={2}
          bg={colorMode === "light" ? "white" : "gray.700"} // Dynamically set background based on color mode
          boxShadow="md"
          borderRadius="md"
          p={2}
        >
          {searchUsersResults.length > 0 && (
            <Heading size={"xs"} color={"green"}>
              Users
            </Heading>
          )}
          <List>
            {searchUsersResults.map((result) => (
              <ListItem key={result._id}>
                <Link to={`/${result.username}`}>
                  <Text
                    _hover={{ textDecoration: "underline", cursor: "pointer" }}
                    color={colorMode === "light" ? "black" : "white"} // Dynamically set text color based on color mode
                  >
                    <strong>{result.username}</strong> - {result.name}
                  </Text>
                </Link>
              </ListItem>
            ))}
          </List>
          {searchPostsResults.length > 0 && (
            <>
              {searchPostsResults.length > 0 && (
                <Heading size={"xs"} color={"green"}>
                  Events
                </Heading>
              )}

              <List>
                {searchPostsResults.map((result) => (
                  <ListItem key={result._id}>
                    <Link
                      to={`/${result.postedBy.username}/post/${result._id}`}
                    >
                      <Text
                        _hover={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                        color={colorMode === "light" ? "black" : "white"} // Dynamically set text color based on color mode
                      >
                        <strong>{result.username}</strong> - {result.name}
                      </Text>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      )}

      {/* Posts section */}
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

        {/* Suggested users section */}
        <Box flex={30} display={{ base: "none", md: "block" }}>
          <SuggestedUsers />
        </Box>
      </Flex>
    </Flex>
  );
};

export default HomePage;

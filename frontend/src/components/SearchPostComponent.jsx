import { useState } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Box,
  Text,
  List,
  ListItem,
  ListIcon,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

const SearchPostComponent = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate(); // Initialize navigate from react-router-dom

  const handleSearchInputChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`/api/posts/search/${query}`);
      const data = response.data.slice(0, 5); // Limit suggestions to 5
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    console.log("Clicked suggestion:", suggestion);
    try {
      const response = await axios.get(`/api/posts/${suggestion._id}`);
      console.log("Post details:", response.data);
      // Navigate to post page
      navigate(`/${suggestion.postedBy.username}/post/${suggestion._id}`); // Use navigate instead of history.push
    } catch (error) {
      console.error("Error fetching post details:", error);
      // Handle error gracefully
    }
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get(`/api/posts/search/${searchQuery}`);
      setSearchResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setLoading(false);
    }
  };

  return (
    <Box>
      <form onSubmit={handleSearchSubmit}>
        <Flex>
          <Input
            type="text"
            placeholder="Search for posts..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            variant="filled"
            mr={2}
          />
          <Button
            type="submit"
            colorScheme="teal"
            isLoading={loading}
            loadingText="Searching"
          >
            Search
          </Button>
        </Flex>
      </form>
      <Box mt={4}>
        {suggestions.length > 0 && (
          <List spacing={1} bg="white" boxShadow="md" p={2}>
            {suggestions.map((suggestion) => (
              <ListItem
                key={suggestion._id}
                cursor="pointer"
                onClick={() => handleSuggestionClick(suggestion)}
                _hover={{ bg: "gray.100" }}
              >
                <ListIcon as={CheckCircleIcon} color="green.500" />
                {suggestion.name}
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Box mt={4}>
        {loading ? (
          <Spinner size="xl" />
        ) : searchResults.length > 0 ? (
          <List spacing={3}>
            {searchResults.map((post) => (
              <ListItem key={post._id}>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                {post.name}
              </ListItem>
            ))}
          </List>
        ) : (
          searchQuery && <Text>No results found</Text>
        )}
      </Box>
    </Box>
  );
};

export default SearchPostComponent;

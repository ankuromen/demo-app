import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Box, Flex, Grid, Select, Spinner, Text } from "@chakra-ui/react";
import Post from "../components/Post";
import useShowToast from "../hooks/useShowToast";
import SearchBar from "../components/SearchBar";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix icon issue with leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const DiscoverPage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const [user] = useRecoilState(userAtom);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);
  const [locationArray, setLocationArray] = useState([]);
  const categories = ["Music", "Technology", "Business", "Networking"];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const locations = [
    { key: "operaHouse", location: { lat: -33.8567844, lng: 151.213108 } },
    { key: "tarongaZoo", location: { lat: -33.8472767, lng: 151.2188164 } },
    { key: "manlyBeach", location: { lat: -33.8209738, lng: 151.2563253 } },
    { key: "hyderPark", location: { lat: -33.8690081, lng: 151.2052393 } },
    { key: "theRocks", location: { lat: -33.8587568, lng: 151.2058246 } },
    { key: "circularQuay", location: { lat: -33.858761, lng: 151.2055688 } },
    { key: "harbourBridge", location: { lat: -33.852228, lng: 151.2038374 } },
    { key: "kingsCross", location: { lat: -33.8737375, lng: 151.222569 } },
    { key: "botanicGardens", location: { lat: -33.864167, lng: 151.216387 } },
    { key: "museumOfSydney", location: { lat: -33.8636005, lng: 151.2092542 } },
    { key: "maritimeMuseum", location: { lat: -33.869395, lng: 151.198648 } },
    {
      key: "kingStreetWharf",
      location: { lat: -33.8665445, lng: 151.1989808 },
    },
    { key: "aquarium", location: { lat: -33.869627, lng: 151.202146 } },
    { key: "darlingHarbour", location: { lat: -33.87488, lng: 151.1987113 } },
    { key: "barangaroo", location: { lat: -33.8605523, lng: 151.1972205 } },
  ];

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
        setPosts([]);
        const { data } = await axios.get("/api/posts/all");
        setPosts(data);
        setFilteredPosts(data);
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
  }, []);

  useEffect(() => {
    const locations = [];
    posts?.forEach((post) => {
      if (!locations.includes(post.venue)) {
        locations.push(post.venue);
      }
      setLocationArray(locations);
    });
  }, [posts]);

  useEffect(() => {
    let filteredPosts = posts;

    if (selectedLocation) {
      filteredPosts = filteredPosts.filter(
        (post) => post.venue === selectedLocation
      );
    }

    if (selectedCategory) {
      filteredPosts = filteredPosts.filter(
        (post) => post.eventType === selectedCategory
      );
    }

    setFilteredPosts(filteredPosts);
  }, [selectedLocation, selectedCategory]);

  console.log(selectedCategory);
  return (
    <Box mx="auto" width="80%" textAlign="center">
      <SearchBar onSearch={handleSearch} />
      {results && (
        <Box p={4} bg="gray.100" mb={4} borderRadius="md">
          <pre>{results}</pre>
        </Box>
      )}
      <Flex gap={10} mt={2}>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Event Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Select Location"
          filled
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          {locationArray.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </Select>
      </Flex>

      <Grid
        gridTemplateColumns={{ base: "1fr", md: "1fr 2fr" }}
        gap="10"
        mt={5}
        alignItems="flex-start"
      >
        <Box>
          <MapContainer
            center={[-33.8567844, 151.213108]}
            zoom={13}
            style={{
              maxHeight: "60vh",
              height: "60vh",
              borderRadius: "5%",
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {locations.map((marker, idx) => (
              <Marker
                key={idx}
                position={[marker.location.lat, marker.location.lng]}
              >
                <Popup>{marker.key}</Popup>
              </Marker>
            ))}
          </MapContainer>
          {/* <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}  >
          <GoogleMap zoom={10}>
            {locations.map((marker, idx) => ( 
              <Marker
                key={idx}
                position={{
                  lat: marker.location.lat,
                  lng: marker.location.lng,
                }}
                title={marker.key}
              />
            ))}
          </GoogleMap>
        </LoadScript> */}
        </Box>
        <Box flex={70} maxH={"60vh"} overflowY={"scroll"}>
          {!loading && posts.length === 0 && (
            <Text fontSize="xl" fontWeight="bold">
              No Post found
            </Text>
          )}

          {loading && (
            <Flex justify="center">
              <Spinner size="xl" />
            </Flex>
          )}

          <Box>
            {!loading &&
              filteredPosts?.map((post) => (
                <Post key={post._id} post={post} postedBy={post.postedBy} />
              ))}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default DiscoverPage;

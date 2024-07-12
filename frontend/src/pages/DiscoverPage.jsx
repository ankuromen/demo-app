import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import SearchPostComponent from "../components/SearchPostComponent.jsx";
import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Select,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { isPointWithinRadius } from "geolib";
import Post from "../components/Post";
import useShowToast from "../hooks/useShowToast";

import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { isAfter, isBefore, parseISO, setHours, setMinutes } from "date-fns";
import { Link } from "react-router-dom";


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
  const [citiesArray, setCitiesArray] = useState([]);
  const [statesArray, setStatesArray] = useState([]);
  const [countriesArray, setCountriesArray] = useState([]);
  const categories = ["Music", "Technology", "Business", "Networking"];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("00:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("23:59");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");

  const { lat, long } = user.selectedLocationCord && user.selectedLocationCord;

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

  const sortEvents = async () => {
    let filteredPosts = posts;
    let nearbyPosts = [];
    const selectedLocationCord = user?.selectedLocationCord;

    if (selectedLocation) {
      filteredPosts = filteredPosts.filter(
        (post) => post.venue === selectedLocation
      );
    }
    if (selectedCity) {
      filteredPosts = filteredPosts.filter(
        (post) => post.city === selectedCity
      );
    }
    if (selectedState) {
      filteredPosts = filteredPosts.filter(
        (post) => post.state === selectedState
      );
    }
    if (selectedCountry && !searchLocation) {
      filteredPosts = filteredPosts.filter(
        (post) => post.country === selectedCountry
      );
    }


    if (startDate && !startTime) {
      filteredPosts = filteredPosts.filter((post) =>
        isAfter(
          new Date(post.startDate),
          parseISO(new Date(startDate).toISOString())
        )
      );
    }
    if (startDate && startTime) {
      filteredPosts = filteredPosts.filter((post) => {
        const eventDate = new Date(post.startDate);
        eventDate.setMinutes(post.startTime.split(":")[1]);
        eventDate.setHours(post.startTime.split(":")[0]);
        const startDateTime = parseISO(`${startDate}T${startTime}`);
        return isAfter(eventDate, startDateTime);
      });
    }
    if (endDate && !endTime) {
      filteredPosts = filteredPosts.filter((post) =>
        isBefore(
          new Date(post.startDate),
          parseISO(new Date(endDate).toISOString())
        )
      );
    }
    if (endDate && endTime) {
      filteredPosts = filteredPosts.filter((post) => {
        const eventDate = new Date(post.startDate);
        eventDate.setMinutes(post.startTime.split(":")[1]);
        eventDate.setHours(post.startTime.split(":")[0]);
        const endDateTime = parseISO(`${endDate}T${endTime}`);
        return isBefore(eventDate, endDateTime);
      });
    }
    // sort by Category
    if (selectedCategory) {
      filteredPosts = filteredPosts.filter(
        (post) => post.eventType === selectedCategory
      );
    }

    //Sort by user preferred location
    if (
      selectedLocationCord &&
      !selectedLocation &&
      !selectedCity &&
      !selectedCity &&
      !selectedState &&
      !selectedCountry &&
      !searchLocation
    ) {
      nearbyPosts = filteredPosts.filter((post) =>
        isPointWithinRadius(
          {
            latitude: user.selectedLocationCord.lat,
            longitude: user.selectedLocationCord.long,
          },
          { latitude: post.venueCord?.lat, longitude: post.venueCord?.long },
          25000
        )
      );
      setFilteredPosts(nearbyPosts);
      return;
    }

    // sort by Category
    if (selectedCategory) {
      filteredPosts = filteredPosts.filter(
        (post) => post.eventType === selectedCategory
      );
    }

    setFilteredPosts(filteredPosts);
  };
  console.log("Posts", filteredPosts);

  useEffect(() => {
    const cities = [];
    const states = [];
    const countries = [];
    posts?.forEach((post) => {
      if (!cities.includes(post.city)) {
        post.city && cities.push(post.city);
      }
      setCitiesArray(cities);
      if (!states.includes(post.state)) {
        post.state && states.push(post.state);
      }
      setStatesArray(states);
      if (!countries.includes(post.country)) {
        post.country && countries.push(post.country);
      }
      setCountriesArray(countries);
    });
  }, [posts]);

  useEffect(() => {
    sortEvents();
  }, [
    user,
    posts,
    selectedLocation,
    selectedCity,
    selectedState,
    selectedCountry,
    selectedCategory,
    startDate,
    startTime,
    endDate,
    endTime,
  ]);

  return (
    <Box mx="auto" width="80%" textAlign="center">
      <SearchPostComponent user={user}/>
      <Flex gap={10} mt={2} alignItems={"center"}>

        <Text fontWeight={"bold"} color={"red"}>
          Start
        </Text>
        <Input
          type="date"
          w={"60%"}
          value={startDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="time"
          w={"40%"}
          value={startTime}
          defaultValue={"00:00"}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Text fontWeight={"bold"} color={"red"}>
          End
        </Text>
        <Input
          type="date"
          value={endDate}
          min={startDate}
          w={"60%"}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Input
          type="time"
          value={endTime}
          w={"40%"}
          onChange={(e) => setEndTime(e.target.value)}
        />
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
          placeholder="Select City"
          filled
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {citiesArray.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Select State"
          filled
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          {statesArray.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Select Country"
          filled
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          {countriesArray.map((country) => (
            <option key={country} value={country}>
              {country}
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
            center={[lat, long]}
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
            {posts.map(
              (marker, idx) =>
                marker?.venueCord && (
                  <Marker
                    key={idx}
                    position={[marker?.venueCord?.lat, marker?.venueCord?.long]}
                  >
                    <Popup>
                      {marker.name}
                      <br />
                      Venue : {marker.venue}
                      <br />
                      <Link to={`/${user.username}/post/${marker._id}`}>
                        <Button
                          size={"xs"}
                          mt={2}
                          bg={useColorModeValue("black", "white")}
                          color={useColorModeValue("white", "black")}
                          _hover={{
                            background: useColorModeValue(
                              "gray.700",
                              "gray.300"
                            ),
                          }}
                          p={2}
                          gap={2}
                          mr={3}
                        >
                          More
                        </Button>
                      </Link>
                    </Popup>
                  </Marker>
                )
            )}
          </MapContainer>

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

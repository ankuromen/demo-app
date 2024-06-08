import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
    interests: user.interests,
    location: user.location,
    occupation: user.occupation,
    instagram: user.instagram,
    linkedin: user.linkedin,
    twitter: user.twitter,
    youtube: user.youtube,
    tiktok: user.tiktok,
    website: user.website,
  });
  console.log(user);
  const fileRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  const { handleImageChange, imgUrl } = usePreviewImg();
  const inputRef = useRef();
  const navigate =useNavigate()
  const handlePlaceChanged =async () => {

    const [place] =await inputRef.current.getPlaces();

    if (place) {
      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());
      setInputs({
        ...inputs,
        location: place.formatted_address,
        // Optionally, you can also store latitude and longitude
        // latitude: location.lat(),
        // longitude: location.lng(),
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });
      const data = await res.json(); // updated user object
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Profile updated successfully", "success");
      setUser(data);
      localStorage.setItem("user-threads", JSON.stringify(data));
      navigate(`/${user.name}`)
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgUrl || user.profilePic}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="John Doe"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="johndoe"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="email"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your bio."
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Interests</FormLabel>
            <Input
              placeholder="Your interests"
              value={inputs.interests}
              onChange={(e) =>
                setInputs({ ...inputs, interests: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <LoadScript
              googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
              libraries={["places"]}
            >
              <StandaloneSearchBox
                onLoad={(ref) => (inputRef.current = ref)}
                onPlacesChanged={handlePlaceChanged}
              >
                <Input
                  placeholder="Your location"
                  value={inputs.location}
                  onChange={(e) =>
                    setInputs({ ...inputs, location: e.target.value })
                  }
                  _placeholder={{ color: "gray.500" }}
                  type="text"
                />
              </StandaloneSearchBox>
            </LoadScript>
          </FormControl>

          <FormControl>
            <FormLabel>Occupation</FormLabel>
            <Input
              placeholder="Your occupation"
              value={inputs.occupation}
              onChange={(e) =>
                setInputs({ ...inputs, occupation: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Instagram</FormLabel>
            <Input
              placeholder="Your Instagram handle"
              value={inputs.instagram}
              onChange={(e) =>
                setInputs({ ...inputs, instagram: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>LinkedIn</FormLabel>
            <Input
              placeholder="Your LinkedIn Profile"
              value={inputs.linkedin}
              onChange={(e) =>
                setInputs({ ...inputs, linkedin: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>X</FormLabel>
            <Input
              placeholder="Your X Profile"
              value={inputs.twitter}
              onChange={(e) =>
                setInputs({ ...inputs, twitter: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Tiktok</FormLabel>
            <Input
              placeholder="Your Tiktok Profile"
              value={inputs.tiktok}
              onChange={(e) => setInputs({ ...inputs, tiktok: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Youtube</FormLabel>
            <Input
              placeholder="Your Youtube Profile"
              value={inputs.youtube}
              onChange={(e) =>
                setInputs({ ...inputs, youtube: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Website</FormLabel>
            <Input
              placeholder="Your Website"
              value={inputs.website}
              onChange={(e) =>
                setInputs({ ...inputs, website: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
              onClick={()=>navigate(`/${user.name}`)}
            >
              Cancel
            </Button>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}

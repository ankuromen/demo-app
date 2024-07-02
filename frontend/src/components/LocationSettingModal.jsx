import { useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { StandaloneSearchBox } from "@react-google-maps/api";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

const LocationSettingModal = ({
  locationSettingsOpen,
  setLocationSettingsOpen,
  user,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [location, setLocation] = useState(
    user.selectedLocation ? user.selectedLocation : ""
  );
  const inputRef = useRef();
  const setUser = useSetRecoilState(userAtom);
  console.log(user);
  const handlePlaceChanged = async () => {
    const [place] = await inputRef.current.getPlaces();

    if (place) {
      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());
      setLocation(place.formatted_address);
    }
  };
  useEffect(() => {
    if (locationSettingsOpen) {
      onOpen();
    }
  }, [locationSettingsOpen]);

  const updateSelectedLocation = async () => {
    try {
      const res = await axios.post("/api/users/update-selectedlocation", {
        userId: user._id,
        selectedLocation: location,
      });
      localStorage.setItem("user-threads", JSON.stringify(res.data));
      setUser(res.data);
      setLocationSettingsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const closeLocation = () => {
    setLocationSettingsOpen && setLocationSettingsOpen(!locationSettingsOpen);
  };
  console.log(locationSettingsOpen);

  return (
    <Modal isOpen={locationSettingsOpen} onClose={closeLocation} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Location</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <StandaloneSearchBox
            onLoad={(ref) => (inputRef.current = ref)}
            onPlacesChanged={handlePlaceChanged}
          >
            <Input
              type="text"
              style={{ width: "100%" }}
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </StandaloneSearchBox>
        </ModalBody>

        <ModalFooter>
          <Button
            size={"sm"}
            bg={useColorModeValue("black", "white")}
            color={useColorModeValue("white", "black")}
            _hover={{
              background: useColorModeValue("gray.700", "gray.300"),
            }}
            p={2}
            gap={2}
            mr={3}
            onClick={updateSelectedLocation}
          >
            Save Location
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LocationSettingModal;

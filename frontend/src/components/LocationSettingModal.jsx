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
  useColorModeValue,
} from "@chakra-ui/react";
import { Autocomplete } from "@react-google-maps/api";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

const LocationSettingModal = ({
  locationSettingsOpen,
  setLocationSettingsOpen,
  user,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [location, setLocation] = useState(
    user.selectedLocation ? user.selectedLocation : ""
  );
  const [selectedLocationLat, SetselectedLocationLat] = useState();
  const [selectedLocationLong, SetselectedLocationLong] = useState();
  const inputRef = useRef();
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  const handlePlaceChanged = () => {
    const place = inputRef.current.getPlace();
    if (place) {
      SetselectedLocationLat(place.geometry.location.lat());
      SetselectedLocationLong(place.geometry.location.lng());
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
        selectedLocationLat: selectedLocationLat,
        selectedLocationLong: selectedLocationLong,
      });
      localStorage.setItem("user-threads", JSON.stringify(res.data));
      setUser(res.data);
      setLocationSettingsOpen(false);
      showToast("success", "Location Updated", "success");
    } catch (error) {
      showToast("error", "Error", "error");
    }
  };

  const closeLocation = () => {
    setLocationSettingsOpen && setLocationSettingsOpen(!locationSettingsOpen);
  };

  return (
    <Modal isOpen={locationSettingsOpen} onClose={closeLocation} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Location</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Autocomplete
            onLoad={(ref) => (inputRef.current = ref)}
            onPlaceChanged={handlePlaceChanged}
            options={{
              types: ["(cities)"],
            }}
          >
            <Input
              type="text"
              style={{ width: "100%" }}
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Autocomplete>
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

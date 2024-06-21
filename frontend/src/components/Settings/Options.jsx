import {
  Box,
  Flex,
  Heading,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import userAtom from "../../atoms/userAtom";
import { useRecoilValue } from "recoil";

const Options = () => {
  const [publicGuest, setPublicGuest] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const fetchUserSettings = async () => {
      const res = await axios.get("/api/users/settings", {
        params: { userId: user._id },
      });
      setFeedback(res.data?.feedback)
      setPublicGuest(res.data?.publicguest)
    };
    fetchUserSettings();
  }, [user]);

  const handleSwitchChange = async (userId, setting, value) => {
    try {
      const response = await axios.post("/api/users/update-settings", {
        userId,
        setting,
        value,
      });

      if (response.status === 200) {
        if (setting === "publicGuest") {
          setPublicGuest(value);
        } else if (setting === "feedback") {
          setFeedback(value);
        }
      } else {
        console.error("Error updating setting:", response.status);
      }
    } catch (error) {
      console.error("Error updating setting:", error);
    }
  };

  return (
    <Flex flexDir={"column"} gap={2}>
      <Heading fontSize={"xl"} fontWeight={"medium"}>
        Event Defaults
      </Heading>
      <Text color={"gray.600"}>Default settings for events</Text>

      <Flex
        flexDir={"column"}
        bg={useColorModeValue("white", "gray.800")}
        borderRadius={"lg"}
      >
        <Flex justifyContent={"space-between"} alignItems={"center"} p={2}>
          <Box>
            <Text fontWeight={500}>Public Guest List</Text>
            <Text fontSize={"sm"} color={"gray.500"}>
              Whether to show guest list on event pages.
            </Text>
          </Box>
          <Switch
            isChecked={publicGuest}
            onChange={(e) =>
              handleSwitchChange(user._id, "publicGuest", e.target.checked)
            }
          />
        </Flex>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          p={2}
          borderBottom={1}
        >
          <Box>
            <Text fontWeight={500}>Collect Feedback</Text>
            <Text fontSize={"sm"} color={"gray.500"}>
              Email guests after the event to collect feedback.
            </Text>
          </Box>
          <Switch
            isChecked={feedback}
            onChange={(e) =>
              handleSwitchChange(user._id, "feedback", e.target.checked)
            }
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Options;

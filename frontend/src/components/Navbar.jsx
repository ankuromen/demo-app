import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Link,
  Text,
  useColorMode,
  useColorModeValue,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { RxAvatar } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { IoMdHome, IoIosLogIn } from "react-icons/io";
import { BsClipboardData } from "react-icons/bs";
import { MdOutlineExplore } from "react-icons/md";
import { CiLocationOn, CiMenuFries } from "react-icons/ci";
import { useState } from "react";
import LocationSettingModal from "./LocationSettingModal";
import {
  IoChatbubbleOutline,
  IoCreateOutline,
  IoTicketOutline,
} from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { PiGearSixLight } from "react-icons/pi";
import { AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const { toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const logout = useLogout();
  const Navigate = useNavigate();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [locationSettingsOpen, setLocationSettingsOpen] = useState(false);
  const [isSmallScreen] = useMediaQuery("(max-width: 768px)");
  const [isMediumScreen] = useMediaQuery(
    "(min-width: 769px) and (max-width: 991px)"
  );
  const [isLargeScreen] = useMediaQuery("(min-width: 992px)");
  const [showMobileMenu, setshowMobileMenu] = useState(false);

  return (
    <>
      <Flex
        flexDirection={"column"}
        position={"fixed"}
        top={0}
        bottom={0}
        zIndex={9999}
        backdropFilter={{
          base: "blur(15px) saturate(1.5)",
          md: "blur(0)",
        }}
        transition={showMobileMenu ? "all 0.3s ease-in-out" : "none"}
        width={{ md: "50px 1fr", lg: "200px 1fr" }}
        minW={
          isLargeScreen
            ? "200px"
            : isMediumScreen
            ? "50px"
            : isSmallScreen
            ? showMobileMenu
              ? "100vh"
              : "fit-content"
            : ""
        }
        minHeight={
          isSmallScreen && showMobileMenu
            ? "-webkit-fill-available"
            : "fit-content"
        }
        p={4}
        justifyContent={isSmallScreen ? "flex-start" : "space-between"}
        h={isSmallScreen ? (showMobileMenu ? "100vh" : "fit-content") : "100vh"}
        overflow={"hidden"}
      >
        <Box
          onClick={() => setshowMobileMenu(!showMobileMenu)}
          w={"fitcontent"}
          display={isSmallScreen ? "block" : "none"}
        >
          {showMobileMenu ? (
            <AiOutlineClose size={20} />
          ) : (
            <CiMenuFries size={16} />
          )}
        </Box>
        <Flex
          gap={7}
          flexDirection={"column"}
          justifyContent={"center"}
          display={isSmallScreen ? (showMobileMenu ? "flex" : "none") : "flex"}
        >
          <Text
            colorScheme="white"
            onClick={toggleColorMode}
            mb={2}
            mt={5}
            fontStyle={"italic"}
            letterSpacing={5}
            fontWeight={600}
            fontSize={"larger"}
            w={"100%"}
            cursor={"pointer"}
            display={{ md: "none", lg: "contents" }}
          >
            {isLargeScreen || isSmallScreen ? "Evntiq" : ""}
          </Text>
          {user && (
            <>
              {" "}
              <Flex
                flexDirection={"row"}
                alignItems={"center"}
                gap={2}
                cursor={"pointer"}
                onClick={() => {
                  setshowMobileMenu(false);
                  Navigate("/");
                }}
              >
                <IoMdHome size={22} />
                <Text display={{ md: "none", lg: "contents" }}>Home</Text>
              </Flex>
              <Flex
                flexDirection={"row"}
                alignItems={"center"}
                gap={2}
                cursor={"pointer"}
                onClick={() => {
                  setshowMobileMenu(false);
                  Navigate("/discover");
                }}
              >
                <MdOutlineExplore size={22} />
                <Text display={{ md: "none", lg: "contents" }}>Discover</Text>
              </Flex>
              <Flex
                flexDirection={"row"}
                alignItems={"center"}
                gap={2}
                cursor={"pointer"}
                onClick={() => {
                  setshowMobileMenu(false);
                  Navigate("/chat");
                }}
              >
                <IoChatbubbleOutline size={22} />
                <Text display={{ md: "none", lg: "contents" }}>Chat</Text>
              </Flex>
              <Flex
                flexDirection={"row"}
                alignItems={"center"}
                gap={2}
                cursor={"pointer"}
                onClick={() => {
                  setshowMobileMenu(false);
                  Navigate("/create");
                }}
              >
                <IoCreateOutline size={22} />
                <Text display={{ md: "none", lg: "contents" }}>Create</Text>
              </Flex>
              <Flex
                flexDirection={"row"}
                alignItems={"center"}
                gap={2}
                cursor={"pointer"}
                onClick={() => {
                  setshowMobileMenu(false);
                  Navigate("/tickets");
                }}
              >
                <IoTicketOutline size={22} />
                <Text display={{ md: "none", lg: "contents" }}>Tickets</Text>
              </Flex>
              <Flex
                flexDirection={"row"}
                alignItems={"center"}
                gap={2}
                cursor={"pointer"}
                onClick={() => {
                  setshowMobileMenu(false);
                  Navigate(`/${user.username}`);
                }}
              >
                <RxAvatar size={22} />
                <Text display={{ md: "none", lg: "contents" }}>Profile</Text>
              </Flex>
              <Flex
                flexDirection={"row"}
                alignItems={"center"}
                gap={2}
                cursor={"pointer"}
                onClick={() => {
                  setshowMobileMenu(false);
                  logout;
                }}
              >
                <FiLogOut size={22} />
                <Text display={{ md: "none", lg: "contents" }}>Logout</Text>
              </Flex>
            </>
          )}
          {!user && (
            <Flex
              display={
                isSmallScreen ? (showMobileMenu ? "flex" : "none") : "flex"
              }
            >
              <Flex
                flexDirection={"row"}
                alignItems={"center"}
                gap={2}
                cursor={"pointer"}
                onClick={() => {
                  setshowMobileMenu(false);
                  setAuthScreen("login");
                  Navigate("/auth");
                }}
              >
                <IoIosLogIn size={22} />
                <Text display={{ md: "none", lg: "contents" }}>Login</Text>
              </Flex>
              <Flex
                flexDirection={"row"}
                alignItems={"center"}
                gap={2}
                cursor={"pointer"}
                onClick={() => {
                  setshowMobileMenu(false);
                  setAuthScreen("signup");
                  Navigate("/auth");
                }}
              >
                <IoIosLogIn size={22} />
                <Text display={{ md: "none", lg: "contents" }}>Signup</Text>
              </Flex>
            </Flex>
          )}
        </Flex>
        {user && (
          <VStack
            gap={3}
            alignItems={"start"}
            display={
              isSmallScreen ? (showMobileMenu ? "flex" : "none") : "flex"
            }
          >
            <Flex alignItems={"center"} gap={4}>
              <Flex
                alignItems={"center"}
                gap={2}
                onClick={() => {
                  setshowMobileMenu(false);
                  setLocationSettingsOpen(!locationSettingsOpen);
                }}
                cursor={"pointer"}
              >
                <CiLocationOn size={22} />
                <Text
                  display={{ md: "none", lg: "contents" }}
                  fontSize={"small"}
                  color={useColorModeValue("Tomato", "greenyellow")}
                >
                  {user?.selectedLocation
                    ? user.selectedLocation
                    : "Select Location"}
                </Text>
              </Flex>
            </Flex>
            {user && (
              <LocationSettingModal
                locationSettingsOpen={locationSettingsOpen}
                setLocationSettingsOpen={setLocationSettingsOpen}
                user={user}
              />
            )}
            <Flex
              flexDirection={"row"}
              alignItems={"center"}
              gap={2}
              cursor={"pointer"}
              onClick={() => {
                setshowMobileMenu(false);
                Navigate("/analytics");
              }}
            >
              <BsClipboardData size={20} />
              <Text display={{ md: "none", lg: "contents" }}>Analytics</Text>
            </Flex>
            <Flex
              flexDirection={"row"}
              alignItems={"center"}
              gap={2}
              cursor={"pointer"}
              onClick={() => {
                setshowMobileMenu(false);
                Navigate("/settings");
              }}
            >
              <PiGearSixLight size={22} />
              <Text display={{ md: "none", lg: "contents" }}>Settings</Text>
            </Flex>
          </VStack>
        )}
      </Flex>
    </>
  );
};

export default Navbar;

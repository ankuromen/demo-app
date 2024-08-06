import {
  Box,
  Flex,
  List,
  ListItem,
  Link,
  Grid,
  useColorModeValue,
} from "@chakra-ui/react";
import { Route, NavLink, Routes } from "react-router-dom";
import { LuBadgeDollarSign } from "react-icons/lu";
import {
  MdOutlineSettingsInputComponent,
  MdAdminPanelSettings,
  MdMotionPhotosPaused,
  MdOutlineWorkspacePremium,
} from "react-icons/md";
import { ImEmbed2 } from "react-icons/im";
import Options from "../components/Settings/Options";
import Payment from "../components/Settings/Payment";
import Admins from "../components/Settings/Admins";
import Embed from "../components/Settings/Embed";
import EvntiqPlus from "../components/Settings/EvntiqPlus";
import AccountSettings from "../components/Settings/AccountSettings";

export const SettingsPage = () => {
  const menuItems = [
    {
      label: "Account",
      path: "/settings/account",
      icon: <MdMotionPhotosPaused />,
    },
    {
      label: "Options",
      key: "options",
      icon: <MdOutlineSettingsInputComponent />,
      path: "/settings/options",
    },
    {
      label: "Payment",
      key: "payment",
      icon: <LuBadgeDollarSign />,
      path: "/settings/payment",
    },
    {
      label: "Admins",
      key: "admins",
      icon: <MdAdminPanelSettings />,
      path: "/settings/admins",
    },
    {
      label: "Embed",
      key: "embed",
      icon: <ImEmbed2 />,
      path: "/settings/embed",
    },
    {
      label: "Evntiq+",
      key: "evntiq-plus",
      icon: <MdOutlineWorkspacePremium />,
      path: "/settings/evntiq-plus",
    },
  ];
  return (
    <Grid
      w={{ base: "full", md: "80%" }}
      justifyContent={"start"}
      m={"auto"}
      gridTemplateColumns={{ base: "1fr", md: "1fr 3fr" }}
    >
      <Flex
        w={{ base: "100%", md: "200px" }}
        borderBottom={{ base: "1px", md: "none" }}
        borderColor="gray.200"
        p={4}
        overflowX={{ base: "auto", md: "visible" }} // Scrollable on smaller screens
        maxW={{ base: "100%", md: "none" }} // Full width on smaller screens
        overflowY={{ base: "visible", md: "auto" }} // Scrollable on larger screens
        alignItems={"center"}
        css={{
          /* Webkit Browsers */
          "&::-webkit-scrollbar": {
            width: "1px",
            height: "1px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
          },
          /* Firefox */
          "&": {
            scrollbarWidth: "",
            scrollbarColor: "rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <List
          spacing={2}
          display={{ base: "flex", md: "block" }}
          flexDirection={{ base: "row", md: "column" }}
          alignItems={"center"}
        >
          {menuItems.map((item) => (
            <ListItem key={item.key} p={3}>
              <Link
                as={NavLink}
                to={item.path}
                display={"flex"}
                flexDir={"row"}
                alignItems={"center"}
                gap={1}
                color={"gray.500"}
                _activeLink={{
                  fontWeight: "bold",
                  color: useColorModeValue("gray.800", "white"),
                }}
                _hover={{ textDecoration: "none" }}
              >
                {item.icon && item.icon}
                {item.label}
              </Link>
            </ListItem>
          ))}
        </List>
      </Flex>

      <Box flex="1" p={4} justifyContent={"start"}>
        <Routes>
          <Route path="/options" element={<Options />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/embed" element={<Embed />} />
          <Route path="/Evntiq-plus" element={<EvntiqPlus />} />
          <Route path="/account" element={<AccountSettings />} />
        </Routes>
      </Box>
    </Grid>
  );
};

import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import MassEmail from "../components/MassEmail";
import { useState } from "react";
import QRVerification from "../components/QRVerification";
import AnalyticsHome from "../components/AnalyticsHome";

function Analytics() {
  const [subNav, setSubNav] = useState("");
  return (
    <Box>
      <Flex
        w={"fit-content"}
        m={"auto"}
        bg={useColorModeValue("gray.200", "gray.dark")}
        borderRadius={5}
        p={2}
        gap={3}
      >
        <Text
          onClick={() => setSubNav("")}
          cursor={"pointer"}
          fontWeight={!subNav && "bold"}
        >
          Home
        </Text>
        <Text
          onClick={() => setSubNav("analytics")}
          cursor={"pointer"}
          fontWeight={subNav === "analytics" && "bold"}
        >
          Analytics
        </Text>
        <Text
          onClick={() => setSubNav("qr")}
          cursor={"pointer"}
          fontWeight={subNav === "qr" && "bold"}
        >
          QR Verification
        </Text>
      </Flex>
      {!subNav && <AnalyticsHome/>}
      {subNav === "analytics" && <MassEmail />}
      {subNav === "qr" && <QRVerification />}
    </Box>
  );
}

export default Analytics;

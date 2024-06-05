import {
  Box,
  Button,
  Flex,
  Grid,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  border,
} from "@chakra-ui/react";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { CiGlobe } from "react-icons/ci";

const CreateEventPage = () => {
    
  return (
    <>
      <Grid
        gridTemplateColumns={{ base: "1fr", md: "1fr 2fr" }}
        maxW={{ base: "95%", lg: "50%" }}
        margin={"auto"}
        alignItems={"start"}
      >
        <Flex w="100%" direction={"column"} p={3}>
          <Box
            borderRadius={15}
            overflow={"hidden"}
            w={{ base: "full", md: 300 }}
            h={310}
            border={"1px solid red"}
            alignItems={"center"}
            justifyContent={"center"}
            margin={"auto"}
          >
            {/* <Image src={currentPost.img} w={"full"} h={"full"} /> */}
          </Box>
        </Flex>
        <Flex w="100%" p={3} direction={"column"}>
          <Flex alignItems={"end"} justifyContent={"end"}>
            <Popover>
              <PopoverTrigger>
                <Button
                  size={"xs"}
                  bg="rgba(218, 218, 218, 0.68)"
                  _hover={{ bg: "blue.600", color: "white" }}
                >
                  <RiGitRepositoryPrivateFill />
                  Private
                </Button>
              </PopoverTrigger>
              <PopoverContent boxShadow="md" w={"2xs"}>
                <PopoverArrow />
                <PopoverBody p={0.5}>
                  <Flex
                    flexDirection={"row"}
                    alignItems={"center"}
                    p={1}
                    gap={2}
                    borderRadius={"lg"}
                    _hover={{ bg: "gray.100" }}
                  >
                    <CiGlobe />
                    Public
                  </Flex>
                  <Flex
                    flexDirection={"row"}
                    alignItems={"center"}
                    p={1}
                    borderRadius={"lg"}
                    gap={2}
                    _hover={{ bg: "gray.100" }}
                  >
                    <RiGitRepositoryPrivateFill />
                    Private
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Flex>
        </Flex>
      </Grid>
    </>
  );
};
border;

export default CreateEventPage;

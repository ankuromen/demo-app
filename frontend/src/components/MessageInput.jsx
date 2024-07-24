import {
  Box,
  CloseButton,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../hooks/usePreviewImg";

const MessageInput = ({ setMessages, post }) => {
  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const { onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [isSending, setIsSending] = useState(false);
  const [sharedPost, setSharedPost] = useState(post);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imgUrl && !sharedPost) return;
    if (isSending) return;

    setIsSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          sharedPost: sharedPost && sharedPost,
          recipientId: selectedConversation.userId,
          img: imgUrl,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setMessages((messages) => [...messages, data]);

      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessageText("");
      setImgUrl("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Flex
      w={"full"}
      pt={5}
      pb={5}
      ps={2}
      pe={2}
      flexDirection={"column"}
      bg={useColorModeValue("gray.200", "gray.dark")}
    >
      {sharedPost?._id && (
        <Box
          borderWidth={"1px"}
          borderRadius={"lg"}
          overflow={"hidden"}
          position={"relative"}
          p={"2"}
          mb={"3"}
        >
          <CloseButton
            position="absolute"
            size="md"
            right={0}
            onClick={() => setSharedPost(null)}
          />
          <Text>{`Share event : ${sharedPost?.name}`}</Text>
          <Text>{`Details : ${sharedPost?.text}`}</Text>
        </Box>
      )}
      <Flex gap={2} alignItems={"center"} w={"100%"}>
        <Flex flex={5} cursor={"pointer"} ms={2}>
          <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
          <Input
            type={"file"}
            hidden
            ref={imageRef}
            onChange={handleImageChange}
          />
        </Flex>
        <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
          <InputGroup>
            <Input
              w={"full"}
              placeholder="Type a message"
              onChange={(e) => setMessageText(e.target.value)}
              value={messageText}
              bg={useColorModeValue("gray.50", "whiteAlpha.100")}
              borderRadius={20}
              border={'hidden'}
            />
            <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
              <IoSendSharp />
            </InputRightElement>
          </InputGroup>
        </form>

        <Modal
          isOpen={imgUrl}
          onClose={() => {
            onClose();
            setImgUrl("");
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex mt={5} w={"full"}>
                <Image src={imgUrl} />
              </Flex>
              <Flex justifyContent={"flex-end"} my={2}>
                {!isSending ? (
                  <IoSendSharp
                    size={24}
                    cursor={"pointer"}
                    onClick={handleSendMessage}
                  />
                ) : (
                  <Spinner size={"md"} />
                )}
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </Flex>
  );
};

export default MessageInput;

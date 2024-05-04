import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useToast } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { EmailIcon, AtSignIcon, InfoIcon } from '@chakra-ui/icons'
import { AiOutlineUser, AiFillCompass, AiFillFlag, AiTwotoneHeart } from "react-icons/ai";

const UserHeader = ({ user }) => {
	const toast = useToast();
	const currentUser = useRecoilValue(userAtom); // logged in user
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Success.",
				status: "success",
				description: "Profile link copied.",
				duration: 3000,
				isClosable: true,
			});
		});
	};

	return (
		<VStack gap={4} alignItems={"start"}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontSize={"2xl"} fontWeight={"bold"}>
						{user.name}
					</Text>
					<Flex gap={2} alignItems={"center"}>
						<AtSignIcon />
						<Text fontSize={"sm"}>{user.username}</Text>
						<EmailIcon />
						<Text fontSize={"sm"}>{user.email}</Text>
						<InfoIcon />
						<Text fontSize={"sm"}>{user.occupation}</Text>
					</Flex>
					<Flex gap={2} alignItems={"center"}>
						<AiOutlineUser />
						<Text fontSize={"sm"}>{user.gender}</Text>
						<AiFillCompass />
						<Text fontSize={"sm"}>{user.location}</Text>
						<AiFillFlag />
						<Text fontSize={"sm"}>{user.nationality}</Text>
					</Flex>
					<Flex gap={2} alignItems={"center"}>
						< AiTwotoneHeart />
						<Text fontSize={"sm"}>{user.interests.join(', ')}</Text>
					</Flex>

				</Box>
				<Box>
					{user.profilePic && (
						<Avatar
							name={user.name}
							src={user.profilePic}
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
					{!user.profilePic && (
						<Avatar
							name={user.name}
							src='https://bit.ly/broken-link'
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
				</Box>
			</Flex>

			<Text>{user.bio}</Text>

			{currentUser?._id === user._id && (
				<Link as={RouterLink} to='/update'>
					<Button size={"sm"}>Update Profile</Button>
				</Link>
			)}
			{currentUser?._id !== user._id && (
				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}
			<Flex w={"full"} justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.light"}>{user.followers.length} followers</Text>
					<Box w='1' h='1' bg={"gray.light"} borderRadius={"full"}></Box>
				</Flex>
				<Flex>
					<Box className='icon-container'>
						<Link href={`https://www.instagram.com/${user.instagram}`} isExternal>
							<BsInstagram size={24} cursor={"pointer"} />
						</Link>
					</Box>
					<Box className='icon-container'>
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.dark"}>
									<MenuItem bg={"gray.dark"} onClick={copyURL}>
										Copy link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>
			<Flex w={"full"} justifyContent="space-between">
				{/* Create Campaign button */}
				<Button size={"sm"}>Create Campaign</Button>

				{/* Create Story button */}
				<Button size={"sm"}>Create Reels</Button>

				{/* Create Story button */}
				<Button size={"sm"}>Create Story</Button>

				{/* Create Broadcast button */}
				<Button size={"sm"}>Create Broadcast</Button>
			</Flex>

			<Flex w={"full"}>
				<Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb='3' cursor={"pointer"}>
					<Text fontWeight={"bold"}> Your Events</Text>
				</Flex>
			</Flex>

		</VStack>
	);
};

export default UserHeader;

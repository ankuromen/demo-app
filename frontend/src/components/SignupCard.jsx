import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
	Switch
} from "@chakra-ui/react";
import { StandaloneSearchBox, LoadScript } from "@react-google-maps/api";
import { Checkbox, CheckboxGroup } from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { useState, useRef } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function SignupCard() {
	const [showPassword, setShowPassword] = useState(false);
	const [notificationsEnabled, setNotificationsEnabled] = useState(false);
	const [soloOrganizer, setSoloOrganizer] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const inputRef = useRef();
	const handlePlaceChanged = () => {

		const [place] = inputRef.current.getPlaces();

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
	const [inputs, setInputs] = useState({
		name: "",
		username: "",
		email: "",
		dob: "",
		gender: "",
		nationality: "",
		location: "",
		interests: [],
		student: false,
		university: "",
		course: "",
		occupation: "",
		instagram: "",
		password: "",
		notificationsEnabled: false,
		soloOrganizer: false,
	});

	const showToast = useShowToast();
	const setUser = useSetRecoilState(userAtom);

	const handleSignup = async () => {
		try {
			const res = await fetch("/api/users/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.setItem("user-threads", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast("Error", error, "error");
		}
	};
	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		const inputValue = type === "checkbox" ? checked : value;
		setInputs({ ...inputs, [name]: inputValue });
	};
	return (

		<Flex align={"center"} justify={"center"}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Sign up
					</Heading>
				</Stack>
				<Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}>
					<Stack spacing={4}>
						<HStack>
							<Box>
								<FormControl isRequired>
									<FormLabel>Full name</FormLabel>
									<Input
										type='text'
										onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
										value={inputs.name}
									/>
								</FormControl>
							</Box>
							<Box>
								<FormControl isRequired>
									<FormLabel>Username</FormLabel>
									<Input
										type='text'
										onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
										value={inputs.username}
									/>
								</FormControl>
							</Box>
						</HStack>
						<FormControl isRequired>
							<FormLabel>Email address</FormLabel>
							<Input
								type='email'
								onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
								value={inputs.email}
							/>
						</FormControl>
						<FormControl>
							<FormLabel>Are you a Solo Organizer?</FormLabel>
							<Switch isChecked={inputs.soloOrganizer} onChange={handleInputChange} name="soloOrganizer" />
							<Text>Note: Solo Oragnizer Can Create their own Events.Turn it on if you want to create Events</Text>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Location</FormLabel>
							<LoadScript googleMapsApiKey="AIzaSyAQnl_lRnahonxei5BzTWXSBnnSb0PEOaM" libraries={["places"]}>
								<StandaloneSearchBox onLoad={ref => (inputRef.current = ref)}
									onPlacesChanged={handlePlaceChanged}>
									<Input type="text" placeholder="" />
								</StandaloneSearchBox>
							</LoadScript>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Date of Birth</FormLabel>
							<Input
								type='date'
								onChange={(e) => setInputs({ ...inputs, dob: e.target.value })}
								value={inputs.dob}
							/>
						</FormControl>
						<HStack>
							<FormControl isRequired>
								<FormLabel>Gender</FormLabel>
								<Select
									placeholder="Select gender"
									onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}
									value={inputs.gender}
								>
									<option value="male">Male</option>
									<option value="female">Female</option>
									<option value="trans male">Trans Male</option>
									<option value="trans female">Trans Female</option>
									<option value="non-binary">Non-Binary</option>
									<option value="other">Other</option>
									<option value="prefer not to say">Prefer Not to Say</option>
								</Select>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Nationality</FormLabel>
								<Input
									type='text'
									onChange={(e) => setInputs({ ...inputs, nationality: e.target.value })}
									value={inputs.nationality}
								/>
							</FormControl>
						</HStack>
						<FormControl isRequired>
							<FormLabel>Interests</FormLabel>
							<CheckboxGroup
								value={inputs.interests}
								onChange={(selectedInterests) =>
									setInputs({ ...inputs, interests: selectedInterests })
								}
							>
								<HStack>
									<Checkbox value="sports">Sports</Checkbox>
									<Checkbox value="music">Music</Checkbox>
									<Checkbox value="reading">Reading</Checkbox>
									{/* Add more checkboxes for other interests */}
								</HStack>
							</CheckboxGroup>
						</FormControl>;


						<FormControl isRequired>
							<FormLabel>Are you a student?</FormLabel>
							<CheckboxGroup
								value={inputs.student ? ["yes"] : []}
								onChange={(selectedOptions) =>
									setInputs({
										...inputs,
										student: selectedOptions.includes("yes"),
										university: "", // Reset university field when toggling student
										course: "", // Reset course field when toggling student
									})
								}
							>
								<HStack>
									<Checkbox value="yes">Yes</Checkbox>
								</HStack>
							</CheckboxGroup>
						</FormControl>
						{/* Conditionally render University and Course fields */}
						{inputs.student && (
							<>
								<FormControl isRequired>
									<FormLabel>University</FormLabel>
									<Input
										type="text"
										name="university"
										value={inputs.university}
										onChange={handleInputChange}
									/>
								</FormControl>
								<FormControl isRequired>
									<FormLabel>Course</FormLabel>
									<Input
										type="text"
										name="course"
										value={inputs.course}
										onChange={handleInputChange}
									/>
								</FormControl>
							</>
						)}


						<FormControl isRequired>
							<FormLabel>Occupation</FormLabel>
							<Input
								type='text'
								onChange={(e) => setInputs({ ...inputs, occupation: e.target.value })}
								value={inputs.occupation}
							/>
						</FormControl>

						<FormControl isRequired>
							<FormLabel>Instagram</FormLabel>
							<Input
								type='text'
								onChange={(e) => setInputs({ ...inputs, instagram: e.target.value })}
								value={inputs.instagram}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
									value={inputs.password}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() => setShowPassword((showPassword) => !showPassword)}
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
					
						<FormControl>
							<FormLabel>
								Turn notifications?
							</FormLabel>
							<Switch id="notifications" isChecked={inputs.notificationsEnabled} onChange={handleInputChange} name="notificationsEnabled" />
						</FormControl>
						<Stack spacing={10} pt={2}>
							<Button
								loadingText='Submitting'
								size='lg'
								bg={useColorModeValue("gray.600", "gray.700")}
								color={"white"}
								_hover={{
									bg: useColorModeValue("gray.700", "gray.800"),
								}}
								onClick={handleSignup}
							>
								Sign up
							</Button>
						</Stack>
						<Stack pt={6}>
							<Text align={"center"}>
								Already a user?{" "}
								<Link color={"blue.400"} onClick={() => setAuthScreen("login")}>
									Login
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}

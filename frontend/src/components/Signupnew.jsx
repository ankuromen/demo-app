import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  InputRightElement,
  Link,
  Select,
  Stack,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { LoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Signupnew = () => {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);
  const placesRef = useRef(null);
  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleSignup = async (values) => {
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
      showToast('Success','Account Created Successfully','success')
    } catch (error) {
      showToast("Error", error, "error");
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .matches(/^[A-Za-z\s]*$/, "Name can only contain alphabetic characters"),
    username: Yup.string()
      .required("Username is required")
      .matches(
        /^[a-z0-9_\-@\s]*$/,
        "Username can only contain lowercase letters"
      ),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });
  return (
    <Flex maxW="md" mx="auto" flexDir={"column"}>
      <Heading as="h1" size="xl" textAlign="center" mb={6}>
        Sign Up
      </Heading>
      <Box
        maxW="md"
        mx="auto"
        bg={useColorModeValue("white", "gray.dark")}
        mt={10}
        p={6}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
      >
        <Formik
          initialValues={{
            name: "",
            email: "",
            soloOrganizer: false,
            location: "",
            dob: "",
            gender: "",
            nationality: "",
            interests: [],
            student: false,
            university: "",
            course: "",
            occupation: "",
            instagram: "",
            password: "",
            notificationsEnabled: false,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values);
            handleSignup(values);
            setTimeout(() => {
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <Stack spacing={4}>
                <FormControl id="firstName">
                  <FormLabel>Name</FormLabel>
                  <Field as={Input} type="text" name="name" />
                  <ErrorMessage
                    name="name"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Field as={Input} type="text" name="username" />
                  <ErrorMessage
                    name="username"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Field as={Input} type="email" name="email" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Are you a Solo Organizer?</FormLabel>
                  <Field name="soloOrganizer">
                    {({ field }) => (
                      <Switch
                        id="soloOrganizer"
                        {...field}
                        isChecked={field.value}
                      />
                    )}
                  </Field>
                  <Text>
                    Note: Solo Oragnizer Can Create their own Events.Turn it on
                    if you want to create Events
                  </Text>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <LoadScript
                    googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
                    libraries={["places"]}
                  >
                    <StandaloneSearchBox
                      onLoad={(ref) => (placesRef.current = ref)}
                      onPlacesChanged={() => {
                        const places = placesRef.current.getPlaces();
                        if (places && places.length > 0) {
                          const place = places[0];
                          setFieldValue("venue", place.formatted_address);
                        }
                      }}
                    >
                      <Field
                        as={Input}
                        type="text"
                        name="venue"
                        placeholder="Enter your location"
                      />
                    </StandaloneSearchBox>
                  </LoadScript>
                  <ErrorMessage
                    name="location"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Date of Birth</FormLabel>
                  <Field
                    as={Input}
                    type="date"
                    name="dob"
                    placeholder="Enter your location"
                  />
                </FormControl>
                <HStack>
                  <FormControl isRequired>
                    <FormLabel>Gender</FormLabel>
                    <Field
                      placeholder="Select gender"
                      as={Select}
                      name="gender"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="trans male">Trans Male</option>
                      <option value="trans female">Trans Female</option>
                      <option value="non-binary">Non-Binary</option>
                      <option value="other">Other</option>
                      <option value="prefer not to say">
                        Prefer Not to Say
                      </option>
                    </Field>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Nationality</FormLabel>
                    <Field as={Input} name="nationality" />
                  </FormControl>
                </HStack>
                <FormControl>
                  <FormLabel>Interests</FormLabel>
                  <Field
                    name="interests"
                    type="checkbox"
                    render={({ field }) => (
                      <HStack spacing={4}>
                        <label>
                          <input
                            type="checkbox"
                            {...field}
                            value="sports"
                            checked={values?.interests.includes("sports")}
                            onChange={() => {
                              if (values.interests.includes("sports")) {
                                setFieldValue(
                                  "interests",
                                  values.interests.filter(
                                    (interest) => interest !== "sports"
                                  )
                                );
                              } else {
                                setFieldValue("interests", [
                                  ...values.interests,
                                  "sports",
                                ]);
                              }
                            }}
                          />
                          Sports
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            {...field}
                            value="music"
                            checked={values.interests.includes("music")}
                            onChange={() => {
                              if (values?.interests.includes("music")) {
                                setFieldValue(
                                  "interests",
                                  values.interests.filter(
                                    (interest) => interest !== "music"
                                  )
                                );
                              } else {
                                setFieldValue("interests", [
                                  ...values.interests,
                                  "music",
                                ]);
                              }
                            }}
                          />
                          Music
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            {...field}
                            value="reading"
                            checked={values?.interests.includes("reading")}
                            onChange={() => {
                              if (values.interests.includes("reading")) {
                                setFieldValue(
                                  "interests",
                                  values.interests.filter(
                                    (interest) => interest !== "reading"
                                  )
                                );
                              } else {
                                setFieldValue("interests", [
                                  ...values.interests,
                                  "reading",
                                ]);
                              }
                            }}
                          />
                          Reading
                        </label>
                      </HStack>
                    )}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Field
                    as={Input}
                    type={showPassword ? "text" : "password"}
                    name="password"
                  />
                  <IconButton
                    onClick={handleTogglePassword}
                    icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    style={{
                      position: "absolute",
                      right: "2px",
                    }}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    style={{ color: "red" }}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Are you a student?</FormLabel>
                  <label>
                    <Field
                      type="checkbox"
                      name="student"
                      value={values.student}
                      checked={values.student === "yes"}
                      onChange={() => {
                        setFieldValue(
                          "student",
                          values.student === true ? false : true
                        );
                      }}
                    />{" "}
                    Yes
                  </label>

                  <ErrorMessage
                    name="student"
                    component="div"
                    className="error"
                  />
                </FormControl>

                {/* Conditionally render University and Course fields based on student */}
                {values.student === true ? (
                  <>
                    <FormControl isRequired>
                      <FormLabel>University</FormLabel>
                      <Field
                        type="text"
                        name="university"
                        as={Input}
                        value={values.university}
                      />
                      <ErrorMessage
                        name="university"
                        component="div"
                        className="error"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Course</FormLabel>
                      <Field
                        type="text"
                        name="course"
                        as={Input}
                        value={values.course}
                      />
                      <ErrorMessage
                        name="course"
                        component="div"
                        className="error"
                      />
                    </FormControl>
                  </>
                ) : (
                  <FormControl isRequired>
                    <FormLabel>Occupation</FormLabel>
                    <Field
                      type="text"
                      as={Input}
                      name="occupation"
                      value={values.occupation}
                    />
                    <ErrorMessage
                      name="occupation"
                      component="div"
                      className="error"
                    />
                  </FormControl>
                )}
                <FormControl>
                  <FormLabel>Instagram </FormLabel>
                  <Field
                    type="text"
                    as={Input}
                    name="instagram"
                    value={values.instagram}
                    placeholder="username"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Turn notifications?</FormLabel>
                  <Switch
                    id="notifications"
                    isChecked={values.notificationsEnabled}
                    onChange={() => {
                      setFieldValue(
                        "notificationsEnabled",
                        !values.notificationsEnabled
                      );
                    }}
                    name="notificationsEnabled"
                  />
                </FormControl>
                <Button
                  bg={useColorModeValue("gray.600", "gray.700")}
                  color={"white"}
                  _hover={{
                    bg: useColorModeValue("gray.700", "gray.800"),
                  }}
                  type="submit"
                  size="lg"
                  mt={4}
                  isLoading={isSubmitting}
                >
                  Sign Up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link
                    color={"blue.400"}
                    onClick={() => setAuthScreen("login")}
                  >
                    Login
                  </Link>
                </Text>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
};

export default Signupnew;

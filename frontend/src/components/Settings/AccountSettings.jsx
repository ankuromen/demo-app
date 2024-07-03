import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import useShowToast from "../../hooks/useShowToast";
import useLogout from "../../hooks/useLogout";
import { useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import axios from "axios";
import * as Yup from "yup";

const AccountSettings = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const showToast = useShowToast();
  const logout = useLogout();
  const [email, setEmail] = useState(user.email);
  const [values, setValues] = useState({ password: "", newPassword: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const freezeAccount = async () => {
    if (!window.confirm("Are you sure you want to freeze your account?"))
      return;

    try {
      const res = await fetch("/api/users/freeze", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.error) {
        return showToast("Error", data.error, "error");
      }
      if (data.success) {
        await logout();
        showToast("Success", "Your account has been frozen", "success");
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const updateUserEmail = async () => {
    if (email === user.email)
      return showToast("Error", "Please enter a new email", "error");
    try {
      const res = await axios.put(`/api/users/update-email/${user._id}`, {
        userId: user._id,
        email: email,
      });
      showToast("Success", "Email updated successfully", "success");
      setUser(res.data);
      localStorage.setItem("user-threads", JSON.stringify(res.data));
    } catch {
      console.log("error");
    }
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    newPassword: Yup.string()
      .min(8, "New password must be at least 8 characters")
      .required("New password is required"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await validationSchema.validate(values, { abortEarly: false });

      if (values.password === values.newPassword) {
        throw new Yup.ValidationError(
          "New password cannot be the same as the current password",
          null,
          "newPassword"
        );
      }
      const res = await axios.put("/api/users/update-password", {
        userId: user._id,
        password: values.password,
        newPassword: values.newPassword,
      });
      console.log(res.data);
      setValues({
        password: "",
        newPassword: "",
      });
      showToast("Success", "Password updated successfully", "success");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Something went wrong";
      if (err.name === "ValidationError") {
        const newErrors = err.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setErrors(newErrors);
      } else {
        showToast("Error", errorMessage, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Text my={1} fontWeight={"bold"}>
        Freeze Your Account
      </Text>
      <Text my={1}>You can unfreeze your account anytime by logging in.</Text>
      <Button size={"sm"} colorScheme="red" onClick={freezeAccount}>
        Freeze
      </Button>
      <Text mt={5} fontWeight={"bold"} fontSize={"lg"}>
        Change Account Settings
      </Text>
      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Flex gap={2}>
          {" "}
          <Input
            placeholder="your-email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            _placeholder={{ color: "gray.500" }}
            type="email"
          />
          <Button
            size={"md"}
            bg={useColorModeValue("black", "white")}
            color={useColorModeValue("white", "black")}
            _hover={{
              background: useColorModeValue("gray.700", "gray.300"),
            }}
            p={2}
            gap={2}
            mr={3}
            onClick={updateUserEmail}
          >
            Submit
          </Button>
        </Flex>
      </FormControl>
      <FormControl as="form" onSubmit={updatePassword}>
        <FormLabel>Password</FormLabel>
        <Input
          name="password"
          id="password"
          placeholder="Current Password"
          value={values.password}
          onChange={handleChange}
          _placeholder={{ color: "gray.500" }}
          type="password"
        />
        {errors.password && <Text color="red.500">{errors.password}</Text>}

        <FormLabel mt={4}>New Password</FormLabel>
        <Input
          name="newPassword"
          id="newPassword"
          placeholder="New Password"
          value={values.newPassword}
          onChange={handleChange}
          _placeholder={{ color: "gray.500" }}
          type="password"
        />
        {errors.newPassword && (
          <Text color="red.500">{errors.newPassword}</Text>
        )}

        <Button
          type="submit"
          size={"md"}
          w={"full"}
          bg={useColorModeValue("black", "white")}
          color={useColorModeValue("white", "black")}
          _hover={{
            background: useColorModeValue("gray.700", "gray.300"),
          }}
          p={2}
          gap={2}
          mr={3}
          mt={3}
          isLoading={isSubmitting}
        >
          Change Password
        </Button>
      </FormControl>
    </>
  );
};

export default AccountSettings;

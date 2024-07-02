import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import UserSetting from "../models/userSettingModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { ObjectId } from "mongodb";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -updatedAt").lean();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  // We will fetch user profile either with username or userId
  // query is either username or userId
  const { query } = req.params;
  try {
    let user;
    // query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      // query is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in getUserProfile: ", err.message);
  }
};

const signupUser = async (req, res) => {
  try {
    const {
      name,
      email,
      username,
      dob,
      gender,
      nationality,
      location,
      interests,
      student,
      university,
      course,
      occupation,
      instagram,
      password,
      notificationsEnabled,
      soloOrganizer,
    } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      dob,
      gender,
      nationality,
      location,
      interests,
      student,
      university,
      course,
      occupation,
      instagram,
      password: hashedPassword,
      notificationsEnabled,
      soloOrganizer,
    });
    await newUser.save();
    const currentUser = await User.find({ $or: [{ email }, { username }] });
    console.log(currentUser[0]._id);
    await new UserSetting({ userid: currentUser[0]._id }).save();

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        dob: newUser.dob,
        gender: newUser.gender,
        nationality: newUser.nationality,
        location: newUser.location,
        interests: newUser.interests,
        student: newUser.student,
        university: newUser.university,
        course: newUser.course,
        occupation: newUser.occupation,
        instagram: newUser.instagram,
        linkedin: newUser.linkedin,
        twitter: newUser.twitter,
        youtube: newUser.youtube,
        tiktok: newUser.tiktok,
        website: newUser.website,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
        notificationsEnabled: newUser.notificationsEnabled,
        soloOrganizer: newUser.soloOrganizer,
        selectedLocation: newUser.selectedLocation,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username or password" });

    if (user.isFrozen) {
      user.isFrozen = false;
      await user.save();
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
      interests: user.interests,
      location: user.location,
      occupation: user.occupation,
      instagram: user.instagram,
      linkedin: user.linkedin,
      twitter: user.twitter,
      youtube: user.youtube,
      tiktok: user.tiktok,
      website: user.website,
      soloOrganizer: user.soloOrganizer,
      selectedLocation: user.selectedLocation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in loginUser: ", error.message);
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};

const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // Unfollow user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in followUnFollowUser: ", err.message);
  }
};

const updateUser = async (req, res) => {
  const {
    name,
    email,
    username,
    password,
    bio,
    interests,
    location,
    occupation,
    instagram,
    linkedin,
    twitter,
    tiktok,
    youtube,
    website,
  } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    user.interests = interests || user.interests;
    user.location = location || user.location;
    user.occupation = occupation || user.occupation;
    user.instagram = instagram || user.instagram;
    user.linkedin = linkedin;
    user.twitter = twitter;
    user.youtube = youtube;
    user.tiktok = tiktok;
    user.website = website;

    user = await user.save();

    // Find all posts that this user replied and update username and userProfilePic fields
    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    // password should be null in response
    user.password = null;

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in updateUser: ", err.message);
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    // exclude the current user from suggested users array and exclude users that current user is already following
    const userId = req.user._id;

    const usersFollowedByYou = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByYou.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const freezeAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    user.isFrozen = true;
    await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendEmails = async (req, res) => {
  const { userIds } = req.body;

  try {
    const users = await User.find({ _id: { $in: userIds } }).select(
      "email name"
    );

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MassEmail,
        pass: process.env.MassPass,
      },
    });

    const mailOptions = {
      from: process.env.MassEmail,
      to: users.map((user) => user.email),
      subject: "Mass Email",
      text: "This is a mass email.",
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in sendEmails:", error.message);
  }
};

const searchUsers = async (req, res) => {
  const { q } = req.query;

  try {
    // Search users by name or username, case-insensitive
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { username: { $regex: q, $options: "i" } },
      ],
    })
      .select("-password -updatedAt")
      .lean();

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in searchUsers: ", err.message);
  }
};

const updateSetting = async (req, res) => {
  const { userId, setting, value } = req.body;

  const updateOption = async (userSettings) => {
    if (setting === "publicGuest") {
      userSettings.publicguest = value;
    } else if (setting === "feedback") {
      userSettings.feedback = value;
    }
    await userSettings.save();
  };

  if (userId) {
    try {
      let userSettings = await UserSetting.findOne({ userid: userId });

      if (!userSettings) {
        await new UserSetting({ userid: userId }).save();
        userSettings = await UserSetting.findOne({ userid: userId });
      }

      if (userSettings) {
        await updateOption(userSettings);
        res.status(200).json({ message: "Settings updated successfully" });
      } else {
        res
          .status(500)
          .json({ error: "Failed to create or find user settings" });
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating settings" });
    }
  } else {
    res.status(400).json({ error: "User ID is required" });
  }
};

const getSettings = async (req, res) => {
  const { userId } = req.query;
  try {
    const settings = await UserSetting.findOne({ userid: userId });
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json("error", error);
  }
};
const addAdmins = async (req, res) => {
  const { selectedUsers, userId } = req.body;
  let admins = [];
  if (userId) {
    try {
      let userSettings = await UserSetting.findOne({ userid: userId });
      if (!userSettings) {
        await new UserSetting({ userid: userId }).save();
        userSettings = await UserSetting.findOne({ userid: userId });
      }
      if (userSettings) {
        if (selectedUsers.length > 0) {
          const existingAdminUserIds = userSettings.admins.map(
            (admin) => admin.userid
          );
          const adminsToAdd = selectedUsers.filter(
            (user) => !existingAdminUserIds.includes(user.userid)
          );

          if (adminsToAdd.length > 0) {
            adminsToAdd.forEach((user) => {
              const admin = {
                name: user.name,
                userid: user.userid,
                email: user.email,
              };
              userSettings.admins.push(admin);
            });

            await userSettings.save();
          }
        }
        await userSettings.save();
        let updatedSettings = await UserSetting.findOne({ userid: userId });
        res.status(200).json(updatedSettings?.admins);
      }
    } catch (error) {
      res.status(500).json("error", error);
    }
  }
};

const removeAdmins = async (req, res) => {
  const { userId, currentUser } = req.body;
  if (userId) {
    let userSettings = await UserSetting.findOne({ userid: userId });
    await userSettings.admins.pull({ userid: currentUser.userid });
    userSettings.save();
    let updatedSettings = await UserSetting.findOne({ userid: userId });
    res.status(200).json(updatedSettings?.admins);
  } else {
    res.status(500).json({ error: "User Not Found" });
  }
};
const updateSelectedLocation = async (req, res) => {
  const { userId, selectedLocation } = req.body;
  if (userId) {
    try {
      let user = await User.findById(userId);
      if (!user) return res.status(400).json({ error: "User not found" });
      user.selectedLocation = selectedLocation;
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  } else {
    res.status(500).json({ error: "User Not Found" });
  }
};
export {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount,
  getAllUsers,
  sendEmails,
  searchUsers,
  updateSetting,
  getSettings,
  addAdmins,
  removeAdmins,
  updateSelectedLocation,
};

import express from "express";
import {
  followUnFollowUser,
  getUserProfile,
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
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
  updateUserEmail,
  updateUserPassword,
  sendOTP,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/all", getAllUsers);
router.post("/signup", signupUser);
router.get("/search", searchUsers);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser); // Toggle state(follow/unfollow)
router.put("/update/:id", protectRoute, updateUser);
router.put("/update-email/:id", protectRoute, updateUserEmail);
router.put("/update-password", protectRoute, updateUserPassword);
router.put("/freeze", protectRoute, freezeAccount);
router.post("/send-email", protectRoute, sendEmails);
router.post("/update-settings", protectRoute, updateSetting);
router.get("/settings", protectRoute, getSettings);
router.post("/add-admins", protectRoute, addAdmins);
router.post("/remove-admins", protectRoute, removeAdmins);
router.post("/update-selectedlocation", protectRoute, updateSelectedLocation);
router.post("/send-otp", sendOTP);


export default router;

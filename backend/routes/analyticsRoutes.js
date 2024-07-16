import express from "express";
import mongoose from "mongoose";
const router = express.Router();
import protectRoute from "../middlewares/protectRoute.js";
import {
  getAnalytics,
  getPostAnalytics,
} from "../controllers/analyticsController.js";

router.get("/:userId", protectRoute, getAnalytics);
router.get("/post/:postId", protectRoute, getPostAnalytics);

export default router;

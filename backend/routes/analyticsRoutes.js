import express from "express";
import mongoose from "mongoose";
const router = express.Router();
import protectRoute from "../middlewares/protectRoute.js";
import { getAnalytics } from "../controllers/analyticsController.js";

router.get("/:userId", protectRoute, getAnalytics);

export default router;

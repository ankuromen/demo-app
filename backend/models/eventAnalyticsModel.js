import mongoose from "mongoose";

const eventAnalyticsSchema = new mongoose.Schema({
  eventid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "Post",
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  }, // new field
  totalSales: { type: Number, required: true },
  averageAge: { type: Number, required: true },
  numberOfMales: { type: Number, required: true },
  numberOfFemales: { type: Number, required: true },
  totalLikes: { type: Number, required: true },
  totalComments: { type: Number, required: true },
});

const EventAnalytics = mongoose.model("EventAnalytics", eventAnalyticsSchema);

export default EventAnalytics;

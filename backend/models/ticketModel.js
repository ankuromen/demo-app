import mongoose from "mongoose";
import saveOrUpdateEventAnalytics from "../routes/analyticsFunction.js";

const ticketSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, required: true },
  eventid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Post",
  },
  ticketDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    age: { type: Number, required: true },
    count: { type: Number, required: true }, // Number of tickets (you may adjust this based on your requirements)
    NumberOfMale: { type: Number, required: true },
    NumberOfFemale: { type: Number, required: true },
    eventname: { type: String, required: true },
    eventdate: { type: Date, required: true },
    eventtime: { type: String, required: true },
    ticketprice: { type: Number, required: true },
    interests: [{ type: String }], // Assuming user interests may also be stored in the ticket
    checkin: { type: Boolean, default: false },
  },
});
ticketSchema.post("save", function (doc) {
  saveOrUpdateEventAnalytics(doc.eventid);
});

ticketSchema.post("findOneAndUpdate", function (doc) {
  saveOrUpdateEventAnalytics(doc.eventid);
});


const ticket = mongoose.model("Ticket", ticketSchema);

export default ticket;

import express from "express";
import mongoose from "mongoose"; // Ensure mongoose is imported
import Ticket from "../models/ticketModel.js";
import EventAnalytics from "../models/eventAnalyticsModel.js";
import Post from "../models/postModel.js";

const router = express.Router();

// Route for creating a ticket
router.post("/createTicket", async (req, res) => {
  try {
    const {
      userid,
      eventid,
      name,
      email,
      contactNo,
      age,
      tickets,
      males,
      females,
      eventname,
      eventdate,
      eventtime,
      ticketprice,
      interests,
    } = req.body;

    const eventAnalytics = await EventAnalytics.find({ eventid: eventid });
    const post = await Post.findById(eventid);
    const ticket = new Ticket({
      userid,
      eventid,
      ticketDetails: {
        name,
        email,
        contactNo,
        age,
        count: tickets,
        NumberOfMale: males,
        NumberOfFemale: females,
        eventname,
        eventdate,
        eventtime,
        ticketprice,
        interests,
      },
    });

    if (post.capacity >= 9999) {
      await ticket.save();
      return res.status(201).json({ message: "Ticket created successfully" });
    }
    const availableTickets = post.capacity - eventAnalytics[0].totalSales;

    if (availableTickets > tickets && post.capacity < 9999) {
      await ticket.save();
      return res.status(201).json({ message: "Ticket created successfully" });
    } else {
      return res.status(400).json({ message: `${availableTickets} Tickets left` });
    }
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json({ error: "Failed to create ticket" });
  }
});

// Route for verifying a ticket
router.post("/verifyTicket", async (req, res) => {
  try {
    const { ticketid } = req.body;

    if (!mongoose.Types.ObjectId.isValid(ticketid)) {
      return res.status(400).json({ error: "Invalid ticket ID" });
    }

    const ticket = await Ticket.findById(ticketid);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    if (ticket.used) {
      return res.status(200).json({ message: "Ticket already used" });
    }

    ticket.used = true;
    await ticket.save();

    res.status(200).json({ message: "Ticket used successfully" });
  } catch (error) {
    console.error("Error verifying ticket:", error);
    res.status(500).json({ error: "Failed to verify ticket" });
  }
});

// Route for fetching tickets by user ID
router.get("/gettickets/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    console.log(userid);

    // Use Mongoose's find method to query tickets with the provided userid
    const tickets = await Ticket.find({ userid: userid }).populate("eventid");
    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

export default router;

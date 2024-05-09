import express from "express";
import Ticket from "../models/ticketModel.js";
const router = express.Router();

router.get("/analytics/:userid", async (req, res) => {
    try {
        const { userid } = req.params;

        // Retrieve all tickets associated with the specified user ID
        const tickets = await Ticket.find({ userid });

        // Group tickets by event ID and calculate the sum of counts for each event
        const eventAnalytics = tickets.reduce((acc, ticket) => {
            const eventId = ticket.eventid.toString(); // Convert ObjectId to string
            if (acc[eventId]) {
                acc[eventId].count += ticket.ticketDetails.count;
            } else {
                acc[eventId] = {
                    eventid: eventId,
                    count: ticket.ticketDetails.count
                };
            }
            return acc;
        }, {});

        res.json(Object.values(eventAnalytics)); // Convert object values to array and send as JSON response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
});

export default router;
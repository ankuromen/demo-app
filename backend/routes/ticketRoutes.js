import express from "express";
import Ticket from "../models/ticketModel.js";

const router = express.Router();

// Route for creating a ticket
router.post("/createTicket", async (req, res) => {
	try {
		const { userid, eventid, name, email, contactNo, age, tickets, males, females, eventname, eventdate, eventtime, ticketprice, interests } = req.body;

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

		await ticket.save();

		res.status(201).json({ message: "Ticket created successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to create ticket" });
	}
});
router.get("/gettickets/:userid", async (req, res) => {
    try {
        const { userid } = req.params;
        console.log(userid);
        // Use Mongoose's find method to query tickets with the provided userid
        const tickets = await Ticket.find({ userid: userid });
        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch tickets" });
    }
});

export default router;
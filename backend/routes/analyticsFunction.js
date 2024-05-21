import mongoose from "mongoose";
import Ticket from "../models/ticketModel.js";
import EventAnalytics from "../models/eventAnalyticsModel.js";

async function computeEventAnalytics(eventid) {
  try {
    const tickets = await Ticket.find({ eventid: new mongoose.Types.ObjectId(eventid) });

    if (tickets.length === 0) {
      console.log("No tickets found for this event.");
      return;
    }

    let totalSales = 0;
    let totalAge = 0;
    let numberOfMales = 0;
    let numberOfFemales = 0;

    tickets.forEach(ticket => {
      totalSales += ticket.ticketDetails.count;
      totalAge += ticket.ticketDetails.age * ticket.ticketDetails.count;
      numberOfMales += ticket.ticketDetails.NumberOfMale;
      numberOfFemales += ticket.ticketDetails.NumberOfFemale;
    });

    const averageAge = totalAge / totalSales;

    const analytics = {
      eventid: eventid,
      totalSales: totalSales,
      averageAge: averageAge,
      numberOfMales: numberOfMales,
      numberOfFemales: numberOfFemales,
    };

    return analytics;
  } catch (error) {
    console.error("Error computing event analytics:", error);
  }
}

async function saveOrUpdateEventAnalytics(eventid) {
  const analytics = await computeEventAnalytics(eventid);

  if (!analytics) {
    console.log("No analytics to save or update.");
    return;
  }

  try {
    await EventAnalytics.findOneAndUpdate(
      { eventid: eventid },
      analytics,
      { upsert: true, new: true }
    );
    console.log("Event analytics saved or updated successfully.");
  } catch (error) {
    console.error("Error saving or updating event analytics:", error);
  }
}

export default saveOrUpdateEventAnalytics;
import mongoose from "mongoose";
import Ticket from "../models/ticketModel.js";
import EventAnalytics from "../models/eventAnalyticsModel.js";
import Post from "../models/postModel.js";

async function computeEventAnalytics(eventid) {
  try {
    const tickets = await Ticket.find({ eventid: new mongoose.Types.ObjectId(eventid) });
    const post = await Post.findOne({ _id: new mongoose.Types.ObjectId(eventid) }); // find the post by eventid

    if (tickets.length === 0) {
      console.log("No tickets found for this event.");
      return null;
    }

    if (!post) {
      console.log("No post found for this event.");
      return null;
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

    const averageAge = totalSales > 0 ? totalAge / totalSales : 0;

    // Calculate total likes and total comments
    const totalLikes = post.likes.length;
    const totalComments = post.replies.length;
    const postedBy = post.postedBy; // get postedBy from the post

    const analytics = {
      eventid: eventid,
      postedBy: postedBy, // new field
      totalSales: totalSales,
      averageAge: averageAge,
      numberOfMales: numberOfMales,
      numberOfFemales: numberOfFemales,
      totalLikes: totalLikes,
      totalComments: totalComments,
    };

    return analytics;
  } catch (error) {
    console.error("Error computing event analytics:", error);
    throw error;
  }
}


async function saveOrUpdateEventAnalytics(eventid) {
  try {
    const analytics = await computeEventAnalytics(eventid);

    if (!analytics) {
      console.log("No analytics to save or update.");
      return;
    }

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
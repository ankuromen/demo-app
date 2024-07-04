import EventAnalytics from "../models/eventAnalyticsModel.js";

async function getAnalytics(req, res) {
  const { userId } = req.params;
  if(!userId){
    return res.status(400).json({message: "User not found."})
  }
  try {
    const analytics = await EventAnalytics.find({ postedBy: userId })
      .populate("eventid")
      
    res.status(200).json(analytics);
  }catch(error){
    res.status(500).json({message: error.message})
  }
}

export { getAnalytics };

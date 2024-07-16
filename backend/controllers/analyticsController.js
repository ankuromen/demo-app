import EventAnalytics from "../models/eventAnalyticsModel.js";

async function getAnalytics(req, res) {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "User not found." });
  }
  try {
    const analytics = await EventAnalytics.find({ postedBy: userId }).populate(
      "eventid"
    );

    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getPostAnalytics(req, res) {
  const { postId } = req.params;
  if (!postId) {
    return res.status(400).json({ message: "Post not found." });
  }
  try {
    const postAnalytics = await EventAnalytics.find({
      eventid: postId,
    });
    res.status(200).json(postAnalytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export { getAnalytics, getPostAnalytics };

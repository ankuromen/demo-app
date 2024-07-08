import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      maxLength: 500,
    },
    img: {
      type: String,
    },
    likes: {
      // array of user ids
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
        },
        username: {
          type: String,
        },
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endDate: {
      type: Date,
    },
    endTime: {
      type: String,
    },
    timeZone: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
    },
    venueCord: {
      lat: {
        type: Number,
      },
      long: {
        type: Number,
      },
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country:{
      type: String,
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    // category: {
    //   type: String,
    //   required: true,
    // },
    isPrivate: {
      type: Boolean,
      required: true,
      default: false, // or whatever default value you want
    },
    ticketSalesStartDate: {
      type: Date,
    },
    ticketSalesStartTime: {
      type: String,
    },

    checkins: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Tickets",
      default: [],
    },
    requireApproval: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;

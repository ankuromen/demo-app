import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
    },
    nationality: {
      type: String,
    },
    location: {
      type: String,
    },
    interests: {
      type: [String],
      default: [],
    },
    occupation: {
      type: String,
    },
    instagram: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    twitter: {
      type: String,
    },
    tiktok: {
      type: String,
    },
    youtube: {
      type: String,
    },
    website: {
      type: String,
    },
    profilePic: {
      type: String,
      default: "",
    },
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    isFrozen: {
      type: Boolean,
      default: false,
    },
    // New fields from frontend component
    student: {
      type: Boolean,
      default: false,
    },
    university: {
      type: String,
    },
    course: {
      type: String,
    },
    notificationsEnabled: {
      type: Boolean,
      default: false,
    },
    soloOrganizer: {
      type: Boolean,
      default: false,
    },
    selectedLocation: {
      type: String,
    },
    selectedLocationCord: {
      lat: {
        type: Number,
      },
      long: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;

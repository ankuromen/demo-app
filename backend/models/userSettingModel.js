import mongoose from "mongoose";
const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);
const userSettingsSchema = mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
  publicguest: {
    type: Boolean,
    default: false,
  },
  feedback: {
    type: Boolean,
    default: false,
  },
  admins: [adminSchema],
});

const UserSetting = mongoose.model("UserSetting", userSettingsSchema);

export default UserSetting;

//User Model
import mongoose from "mongoose";

//userSchema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      //for field validation
      validate: {
        validator: function (v) {
          // Simple email regex validation
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email format!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default:
        "https://i.pinimg.com/736x/59/37/5f/59375f2046d3b594d59039e8ffbf485a.jpg",
    },

    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Array to store all comments made by the user
    recentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;

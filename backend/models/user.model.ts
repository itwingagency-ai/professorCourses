require('dotenv').config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+s/;
const emailRegexPattern: RegExp = /\S+@\S+\.\S+/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isverified: boolean;
  courses: Array<{ courseId: String }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

// Creating user sModel
const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, " please enter your name"],
    },
    email: {
      type: String,
      required: [true, " please enter your email"],
      unique: true,
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
      },
      message: " please enter a valid Email",
    },
    password: {
      type: String,
      // required: [true, " please enter your password"],
      minlength: [6, "Password must be at least 6 Characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isverified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

// Hash Password before Saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// when user hit /login url server responds and sends two cookies ( Access Token, Refresh Token)
// Access token expires in 5  minutes and refresh after long time
// when access token is expires our refresh token tokeen will generate it automatically.


// Sign Access Token e.g when user logged in we will create it and add it our jsonwebtoken
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};


// Sign Refresh Token e.g when user logged in we will create it and add it our jsonwebtoken
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};

// compare Password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// export model
const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;

require("dotenv").config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /\S+@\S+\.\S+/;

// Canonical roles. "user" is kept for backward-compatibility (treated as student).
export type UserRole = "admin" | "student" | "teacher" | "user";

/** Returns true if the role is considered a student (handles legacy "user" role). */
export const isStudentRole = (role: string | undefined): boolean =>
  role === "student" || role === "user";

export interface IUserCourse {
  courseId: string;
  name?: string;
  title?: string;
  thumbnail?: {
    public_id?: string;
    url?: string;
  };
  purchasedAt?: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: UserRole;
  isVerified: boolean;
  courses: IUserCourse[];
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

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
      minlength: [6, "Password must be at least 6 Characters"],
      select: false,
    },

    avatar: {
      public_id: String,
      url: String,
    },

    role: {
      type: String,
      enum: ["admin", "student", "teacher", "user"], // "user" kept for backward compat
      default: "student",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    courses: [
      {
        courseId: {
          type: String,
          required: true,
        },
        name: String,
        title: String,
        thumbnail: {
          public_id: String,
          url: String,
        },
        purchasedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE ? `${process.env.ACCESS_TOKEN_EXPIRE}m` : "5m",
  });
};

userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE ? `${process.env.REFRESH_TOKEN_EXPIRE}d` : "3d",
  });
};

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;

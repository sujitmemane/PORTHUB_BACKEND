import mongoose, { Schema } from "mongoose";

const FONT_FAMILIES = [
  "Inter, sans-serif",
  "Roboto, sans-serif",
  "Poppins, sans-serif",
  "Playfair Display, serif",
  "Fira Code, monospace",
];

export interface Banner {
  bgColor?: string;
  bgText?: string;
}

export interface QuickIntro {
  icon: string;
  text: string;
}

export type FontFamily =
  | "Inter, sans-serif"
  | "Roboto, sans-serif"
  | "Poppins, sans-serif"
  | "Playfair Display, serif"
  | "Fira Code, monospace";

export interface Theme {
  fontFamily: FontFamily;
  primaryColor: string;
  brandColor: string;
}

export interface IUser {
  _id?: string;
  name: string;
  username?: string;
  bio?: string;
  dob?: Date;
  email: string;
  googleId?: string;
  password: string;
  isOnboardingCompleted?: boolean;
  avatar?: string;
  banner?: Banner;
  quickIntros?: QuickIntro[];
  aboutMe?: string;
  theme?: Theme;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,

    unique: true,
  },

  bio: {
    type: String,
  },
  dob: {
    type: Date,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
  },

  password: {
    type: String,
    required: true,
  },
  isOnboardingCompleted: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
  },
  banner: {
    bgColor: String,

    bgText: String,
  },
  quickIntros: [
    {
      icon: String,
      text: String,
    },
  ],

  aboutMe: {
    type: String,
  },
  theme: {
    fontFamily: {
      type: String,
      enum: FONT_FAMILIES,
      default: "Inter, sans-serif",
    },
    primaryColor: { type: String, default: "#111111" },
    brandColor: { type: String, default: "#FFCC00" },
  },
});

export default mongoose.model("User", userSchema);

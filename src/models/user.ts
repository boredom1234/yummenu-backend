import mongoose, { Document, Schema, Model } from "mongoose";

// Define the interface for the User document
export interface IUser extends Document {
  auth0Id: string;
  email: string;
  name?: string;           // Optional fields
  addressLine?: string;
  city?: string;
  country?: string;
}

// Define the Mongoose schema corresponding to the IUser interface
const userSchema = new Schema<IUser>({
  auth0Id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  addressLine: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
});

// Create the Mongoose model for the User
export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

import { Request, Response } from "express";
import { User, IUser } from "../models/user"; // Assuming there's an IUser interface in the User model for type safety

// Get current user by their ID
const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const currentUser: IUser | null = await User.findById(req.userId); // Assuming `req.userId` is set by middleware

    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      return; // Exit after sending the response
    }

    res.json(currentUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Something went wrong while fetching user" });
  }
};

// Create a new user
const createCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { auth0Id } = req.body;
    const existingUser: IUser | null = await User.findOne({ auth0Id });

    if (existingUser) {
      res.status(200).send(); // No need to create a new user, one already exists
      return; // Exit after sending the response
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

// Update current user by their ID
const updateCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, addressLine, country, city } = req.body;

    const user: IUser | null = await User.findById(req.userId); // Assuming `req.userId` is set by middleware

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return; // Exit after sending the response
    }

    // Update the user's fields
    user.name = name;
    user.addressLine = addressLine; // Ensure correct field is used
    user.city = city;
    user.country = country;

    await user.save();

    res.json(user); // Send back the updated user object
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export default {
  getCurrentUser,
  createCurrentUser,
  updateCurrentUser,
};

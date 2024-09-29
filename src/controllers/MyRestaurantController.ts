import { Request, Response } from "express";
import Restaurant, { IRestaurant } from "../models/restaurant"; // Adjusted import
import Order from "../models/order";
import { v2 as cloudinary } from "cloudinary";

const uploadImage = async (file: Express.Multer.File) => {
    const image = file;
    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;
  
    const uploadResponse = await cloudinary.uploader.upload(dataURI);
    return uploadResponse.url;
  };

// Get the current restaurant by the user's ID
const getMyRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant: IRestaurant | null = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return; // Exit after sending the response
    }

    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ message: "Something went wrong while fetching restaurant" });
    return;
  }
};

// Create a new restaurant
const createMyRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const existingRestaurant: IRestaurant | null = await Restaurant.findOne({ user: req.userId });

    if (existingRestaurant) {
      res.status(409).json({ message: "User restaurant already exists" });
      return; // Exit after sending the response
    }

    const newRestaurant = new Restaurant({
      ...req.body,
      user: req.userId,
      imageUrl: await uploadImage(req.file as Express.Multer.File), // Upload the image
      lastUpdated: new Date(),
    });

    await newRestaurant.save();

    res.status(201).json(newRestaurant);
    return;
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({ message: "Error creating restaurant" });
  }
};

// Update the current restaurant
const updateMyRestaurant = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return; // Exit after sending the response
    }

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();
    res.status(200).json(restaurant);

  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ message: "Error updating restaurant" });
  }
};

// Get restaurant orders
const getMyRestaurantOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      res.status(404).json({ message: "restaurant not found" });
      return;
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

// Update order status
const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found" });
      return; // Exit after sending the response
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status" });
  }
};

export default {
  getMyRestaurant,
  createMyRestaurant,
  updateMyRestaurant,
  getMyRestaurantOrders,
  updateOrderStatus,
};

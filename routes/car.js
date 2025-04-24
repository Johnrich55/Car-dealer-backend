import express from "express";
import Car from "../models/Car.js"; // Adjust path based on your project structure

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const cars = await Car.find().populate("user", "_id name email imgurl");
    res.status(200).json(cars);
  } catch (err) {
    console.error("Error fetching all cars:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const cars = await Car.find({ user: userId }).populate(
      "user",
      "name email imgurl"
    );
    res.status(200).json(cars);
  } catch (err) {
    console.error("Error fetching cars by user ID:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/add", async (req, res) => {
  try {
    const newCar = new Car(req.body);
    await newCar.save();
    res.status(200).json({ message: "ok!" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
router.get("/recommendations/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const searchHistory = user.searchHistory;

    if (!searchHistory || searchHistory.length === 0) {
      return res.status(200).json([]);
    }

    // Get recent (e.g., last 3) search items
    const recentSearches = searchHistory.slice(-3);

    // Create a flexible query based on the recent search terms
    const queries = recentSearches.map((search) => {
      const q = {};
      if (search.brand) q.brand = search.brand;
      if (search.model) q.model = search.model;
      if (search.year) q.year = search.year;
      if (search.location) q["location.address"] = search.location;
      return q;
    });

    const recommendedCars = await Car.find({ $or: queries }).populate(
      "user",
      "_id name email imgurl"
    );

    res.status(200).json(recommendedCars);
  } catch (err) {
    console.error("Error fetching car recommendations:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get;
export default router;

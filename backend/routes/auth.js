import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import cors from "cors";

const router = express.Router();


app.use(
  cors({
    origin: "https://e-library-ruby-alpha.vercel.app", // Allow this origin
    credentials: true, // Allow credentials
    methods: "GET, POST, PUT, DELETE", // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);


/* User Registration */
router.post("/register", async (req, res) => {
  try {
    /* Salting and Hashing the Password */
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    /* Create a new user */
    const newuser = new User({
      userType: req.body.userType,
      userFullName: req.body.userFullName,
      admissionId: req.body.admissionId,
      employeeId: req.body.employeeId,
      age: req.body.age,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      password: hashedPass,
      isAdmin: req.body.isAdmin,
    });

    /* Save User and Return */
    const user = await newuser.save();
    res.status(200).json(user);
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* User Login */
router.post("/signin", async (req, res) => {
  try {
    console.log(req.body, "req");

    // Find user by admissionId or employeeId
    const user = req.body.admissionId
      ? await User.findOne({ admissionId: req.body.admissionId })
      : await User.findOne({ employeeId: req.body.employeeId });

    // If no user is found, return an error
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    // Compare the entered password with the hashed password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Successful login
    res.status(200).json(user);
  } catch (err) {
    console.error("Error signing in user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

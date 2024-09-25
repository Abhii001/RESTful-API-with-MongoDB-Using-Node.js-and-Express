import express from 'express';
import mongoose from 'mongoose';
import User from './Users.js';
import dotenv from 'dotenv';
import cors from 'cors';
import bcrypt from 'bcrypt';

dotenv.config(); // Load environment variables from a .env file

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse incoming JSON requests

// MongoDB connection function
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/usersInfo");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1); // Exit the process if connection fails
    }
};
connectDB(); // Establish MongoDB connection

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    res.on('finish', () => {
        console.log(`Response status: ${res.statusCode}`);
    });
    next();
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Hash a single password
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// GET /users - Fetch all users from MongoDB
app.get("/users", async (req, res) => {
    try {
        const users = await User.find(); // Retrieve all users from the database
        res.status(200).json(users); // Respond with the users in JSON format
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
});

// GET /users/:id - Fetch a specific user by MongoDB ObjectId
app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Find user by ID
        if (user) {
            res.status(200).json(user); // Respond with user data if found
        } else {
            res.status(404).json({ message: "User not found" }); // Respond with 404 if user not found
        }
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
});

// POST /users - Add a new user to MongoDB
app.post("/users", async (req, res) => {
    const { firstName, lastName, email, password, hobby, createdAt } = req.body;

    // Log the incoming request body
    console.log("Incoming request body:", req.body);

    // Validate input
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Hash the user's password before saving
        const hashedPassword = await hashPassword(password);

        // Create a new user and save it to the database
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword, // Use the hashed password
            hobby,
            createdAt: createdAt || Date.now() // Set default createdAt if not provided
        });

        console.log("New User Created:", newUser);
        res.status(201).json(newUser); // Respond with the saved user
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: "Email already exists" });
        }
        console.error("Error saving user:", error.message);
        res.status(400).json({ message: "Error saving user", error: error.message });
    }
});

// PUT /users/:id - Update an existing user by MongoDB ObjectId
app.put("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        // If password is being updated, hash the new password
        if (updates.password) {
            updates.password = await hashPassword(updates.password); // Use hashed password in update
        }

        // Update the user and return the new document
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });

        if (updatedUser) {
            res.status(200).json({ message: "User updated successfully", user: updatedUser });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(400).json({ message: "Error updating user", error: error.message });
    }
});

// DELETE /users/:id - Delete a user by MongoDB ObjectId
app.delete("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId); // Find and delete the user by ID

        if (deletedUser) {
            res.status(200).json({ message: "User deleted successfully", user: deletedUser });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
});

// Start the server on port 2100 or the port specified in the environment variable
const PORT = process.env.PORT || 2100;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

import mongoose from "mongoose";

// Define the User schema with validations
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true, // Removes whitespace from the beginning and end
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true, // Removes whitespace from the beginning and end
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // Ensures email is unique
        trim: true,
        lowercase: true, // Converts email to lowercase
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'], // Minimum length for password
    },
    hobby: {
        type: [String], // Array of strings for hobbies
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the current date
    },
});

// Create the User model from the schema
const User = mongoose.model("User", userSchema);

export default User;

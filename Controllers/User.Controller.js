"use strict"

const User = require('../Models/User.Model');
const Jwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Get users
exports.getUsers = async (request, h) => {
    try {
        const users = await User.find({}).select('-password');
        return users;
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Add a user
exports.addUser = async (request, h) => {
    try {
        const { firstName, lastName, email, password } = request.payload;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User ({
            firstName,
            lastName,
            email, 
            password: hashedPassword
        });

        const savedUser = await user.save();
        return h.response(savedUser).code(201);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Update user
exports.updateUser = async (request, h) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(request.params.id, request.payload, { new: true });
        return h.response(updatedUser).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};

// Delete user 
exports.deleteUser = async (request, h) => {
    try {
        await User.findByIdAndDelete(request.params.id);
        return h.response().code(204);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
};

// Login
exports.loginUser = async (request, h) => {
    try {
        const { email, password } = request.payload;

        let user = await User.findOne({ email: email});

        // If the email doenst exist
        if(!user) {
            return h.response({ message: "Email or password is incorrect" }).code(401);
        }

        // Check correct password
        const correctPassword = await bcrypt.compare( password, user.password );
        if(!correctPassword) {
            return h.response({ message: "Email or password is incorrect" }).code(401);
        }

        // Get user, but not password
        user = await User.findOne({ email: email }, { password: 0 });

        // Generate token 
        const token = generateToken(user);

        return h.response({ message: 'You are now logged in!', user: user }).state('jwt', token);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Logout user
exports.logoutUser = async (request, h) => {
    try {
        // Destroy  cookie
        h.unstate('jwt');

        return h.response({ message: "You are now logged out" }).code(200);
    } catch (error) {
        return h.response({ message: "Failed to log out" }).code(500);
    }
}

// Validate token
exports.validateToken = async (request, h) => {
    try {
        return h.response({ message: "Token is valid", user: request.auth.credentials }).code(200);
    } catch (error) {
        return h.response({ message: "Invalid token" }).code(401);
    }
}

// Generate token
const generateToken = (user) => {
    const token = Jwt.token.generate(
        { user },
        { key: process.env.JWT_KEY, algorithm: 'HS256'},
        { ttlSec: 24 * 60 * 60 } // 24 h
    );
    return token;
}
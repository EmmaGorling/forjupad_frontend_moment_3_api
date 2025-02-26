"use strict"

const Blog = require('../Models/Blog.Model');

// Get all posts
exports.getPosts = async (request, h) => {
    try {
        const posts = await Blog.find().populate('author', 'firstName lastName email').sort({createdAt: -1});
        return h.response(posts).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Get post by id
exports.getPostById = async (request, h) => {
    try {
        const post = await Blog.findById(request.params.id).populate('author', 'firstName lastName email');

        if(!post) {
            return h.response({ message: "Post not found" }).code(404);
        } 

        return h.response(post).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Get 10 recent posts
exports.getRecentPosts = async (request, h) => {
    try {
        const posts = await Blog.find({})
            .populate('author', 'firstName lastName email')
            .sort({createdAt: -1})
            .limit(10);

            return h.response(posts).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Add blogpost
exports.createPost = async (request, h) => {
    try {
        const { title, content, userId } = request.payload;
        //const userId = request.auth.credentials.user._id; // Get logged in user

        const newPost = new Blog({ title, content, author: userId });
        const savedPost = await newPost.save();

        return h.response(savedPost).code(201);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Update post, only author
exports.updatePost = async (request, h) => {
    try {
        const post = await Blog.findById(request.params.id);
        const userId = request.auth.credentials.user._id;

        if(!post) {
            return h.response({ message: "Post not found" }).code(404);
        }

        // Controll if the user is the author
        if (post.author.toString() !== userId) {
            return h.response({ message: "Unauthorized" }).code(403);
        }

        post.title = request.payload.title || post.title;
        post.content = request.payload.content || post.content;
        post.updatedAt = Date.now();

        const updatedPost = await post.save();
        return h.response( updatedPost ).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}

// Delete blogpost, only author
exports.deletePost = async (request, h) => {
    try {
        const post = await Blog.findById(request.params.id);
        const userId = request.auth.credentials.user._id;

        if(!post) {
            return h.response({ message: "Post not found" }).code(404);
        }

        // Controll if the user is the author
        if (post.author.toString() !== userId) {
            return h.response({ message: "Unauthorized" }).code(403);
        }

        await post.deleteOne();
        return h.response({ message: "Post deleted successfully" }).code(200);
    } catch (error) {
        return h.response({ message: error.message }).code(500);
    }
}
"use strict"

const BlogController = require('../Controllers/Blog.Controller');
const Joi = require('joi');
const { validate } = require('../Models/Blog.Model');

module.exports = (server) => {
    server.route([
        {
            // Get all posts
            method: 'GET',
            path: '/posts',
            handler: BlogController.getPosts,
            options: {
                auth: false
            }
        },
        {
            // Get post by id
            method: 'GET',
            path: '/posts/{id}',
            handler: BlogController.getPostById,
            options: {
                auth: false
            }
        },
        {
            // Get 10 recent posts
            method: 'GET',
            path: '/posts/recent',
            handler: BlogController.getRecentPosts,
            options: {
                auth: false
            }
        },
        {
            // Create blogpost
            method: 'POST',
            path: '/posts',
            handler: BlogController.createPost,
            options: {
                validate: {
                    payload: Joi.object({
                        title: Joi.string().min(3).max(100).required(),
                        content: Joi.string().min(10).required()
                    }),
                    failAction: (reuest, h, err) => {
                        throw err;
                    }
                }
            }
        },
        {
            // Update a post
            method: 'PUT',
            path: '/posts/{id}',
            handler: BlogController.updatePost,
            options: {
                validate: {
                    payload: Joi.object({
                        title: Joi.string().min(3).max(100),
                        content: Joi.string().min(10)
                    }),
                    failAction: (request, h, err) => {
                        throw err;
                    }
                }
            }
        },
        {
            // Delete blog post
            method: 'DELETE',
            path: '/posts/{id}',
            handler: BlogController.deletePost
        }
    ])
}
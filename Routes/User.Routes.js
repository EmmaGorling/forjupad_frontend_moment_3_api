"use strict"

const userControllers = require('../Controllers/User.Controller');
const Joi = require('joi');

module.exports = (server) => {
    server.route(
        [{
            // Get all users
            method: 'GET',
            path: '/users',
            handler: userControllers.getUsers,
            options: {
                auth: false
            }
        }, 
        {
            // Add user
            method: 'POST',
            path: '/users',
            handler: userControllers.addUser,
            options: {
                auth: false,
                validate: {
                    payload: Joi.object({
                        firstName: Joi.string().min(1).max(30),
                        lastName: Joi.string().min(1).max(30),
                        email: Joi.string().email({ minDomainSegments: 2 }),
                        password: Joi.string().min(8)
                    }),
                    failAction: (request, h, err) => {
                        throw err;
                    }
                }
            }
        },
        {
            // Update user
            method: 'PUT',
            path: '/users/{id}',
            handler: userControllers.updateUser
        },
        {
            // Delete user
            method: 'DELETE',
            path: '/users/{id}',
            handler: userControllers.deleteUser
        },
        {
            // Login user
            method: 'POST',
            path: '/users/login',
            handler: userControllers.loginUser,
            options: {
                auth: false,
                validate: {
                    payload: Joi.object({
                        email: Joi.string().email({ minDomainSegments: 2 }),
                        password: Joi.string().min(8)
                    }),
                    failAction: (request, h, err) => {
                        throw err;
                    }
                }
            }
        },
        {
            // Logout user
            method: 'GET',
            path: '/users/logout',
            handler: userControllers.logoutUser,
            options: {
                auth: false
            }
        },
        {
            // Validate token
            method: 'GET',
            path: '/users/validate',
            handler: userControllers.validateToken
        }]
    )
}
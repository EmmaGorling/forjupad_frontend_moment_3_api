"use strict"

const userControllers = require('../Controllers/User.Controller');
const Joi = require('joi');

module.exports = (server) => {
    server.route(
        [{
            method: 'GET',
            path: '/users',
            handler: userControllers.getUsers
        }, 
        {
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
            method: 'GET',
            path: '/users/logout',
            handler: userControllers.logoutUser,
            options: {
                auth: false
            }
        }]
    )
}
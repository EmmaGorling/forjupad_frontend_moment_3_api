"use strict"

const Cookie = require('@hapi/cookie');
const Jwt = require('@hapi/jwt');
require('dotenv').config();

module.exports = {
    register: async (server) => {
        await server.register([Cookie, Jwt]);

        // Register Cookie strategy
        server.auth.strategy('session', 'cookie', {
            cookie: {
                name: 'jwt',
                password: process.env.COOKIE_PASSWORD,
                isSecure: false,             // HTTPS
                path: '/',
                ttl: 24 * 60 * 60 * 1000,   // 24 hours
                isSameSite: 'None',
                clearInvalid: true,
                isHttpOnly: true
            },
            // Validate HTTP-Cookie
            validate: async (request, session) => {
                try {

                    const token = session;  // Get token
                    
                    if(!token) {
                        return { isValid: false };
                    }
                    const artifacts = Jwt.token.decode(token);

                    try {
                        Jwt.token.verify(artifacts, {
                            key: process.env.JWT_KEY,
                            algorithms: ['HS256']
                        });
                        
                        return {
                            isValid: true,
                            credentials: artifacts.decoded.payload
                        };
                    } catch (error) {
                        console.error('Token verification error:', error);
                        return { isValid: false };
                    }
                } catch (error) {
                    console.error('Validation error:', error);
                    return { isValid: false };
                }
            }
        });

        server.auth.default('session');
    }
}
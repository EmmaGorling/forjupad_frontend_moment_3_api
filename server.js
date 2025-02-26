const Hapi = require('@hapi/hapi');
const Mongoose = require('mongoose');
const auth = require('./auth');
require('dotenv').config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['http://localhost:5500', 'https://www.thunderclient.com', 'http://localhost:5173', 'https://forjupad-frontend-moment-3-api.onrender.com'],
                credentials: true, // Cookies
                maxAge: 86400,
                headers: ["Accept", "Content-Type", "Access-Control-Allow-Origin", "Authorization"]
            }
        }
    });
    
    Mongoose.connect(process.env.DB_URL).then(() => {
        console.log("Connected to MondoDB");
    }).catch((error) => {
        console.log("Error when connecting to database: " + error);
    });

    // Register JWT auth strategy
    await auth.register(server);

    // Routes
    require('./Routes/User.Routes')(server);
    require('./Routes/Blog.Routes')(server);

    await server.start();
    console.log('Server running on %s', server.info.uri);
}

// If unhandled errors, exit process
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1)
});

init();
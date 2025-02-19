const Hapi = require('@hapi/hapi');
const Mongoose = require('mongoose');
require('dotenv').config();

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['http://localhost:5500', 'https://www.thunderclient.com'],
                credentials: true, // Cookies
                maxAge: 86400,
                headers: ["Accept", "Content-Type", "Access-Control-Allow-Origin"]
            }
        }
    });

    Mongoose.connect(process.env.DB_URL).then(() => {
        console.log("Connected to MondoDB");
    }).catch((error) => {
        console.log("Error when connecting to database: " + error);
    });


    await server.start();
    console.log('Server running on %s', server.info.uri);
}

// If unhandled errors, exit process
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1)
});

init();
# Pixel Canvas API

# Getting started

To get the Node server running locally:

- Clone this repo
- Create `.env` file in the root directory
- `npm install` to install all required dependencies
- `npm start` to start the local server

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript
- [dotenv](https://github.com/motdotla/dotenv) - For manging secrets at runtime
- [debug](https://github.com/visionmedia/debug) - Production ready logging
- [socket.io](https://socket.io/) - Socket technology for real-time updates

## Application Structure

- `index.js` - The entry point to our application. This file defines our express server.
- `db.js` - Connects our service to MongoDB using mongoose.
- `utils/` - This folder contains utility methods used throughout the application.
- `routes/` - This folder contains the route definitions for our API.
- `services/` - This folder contains the business logic for our endpoints.
- `models/` - This folder contains the schema definitions for our Mongoose models.
- `sockets/` - This folder contains socket management and message handlers.
- `redis/` - This folder contains redis management functions.


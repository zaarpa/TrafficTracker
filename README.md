# TrafficTracker
This repository contains the source code for Traffic Tracker, an application built using Node.js, Express and MongoDB.

## Prerequisites
Before running the project make sure you have installed [Node.js](https://nodejs.org/en) and [MongoDB](https://www.mongodb.com/).

## Setup Instructions

1.Install Dependencies
   ```bash
   npm install
   ```
2.Include the server running port 3000 and mongoDB credentials in the `.env` file.

3.Start the application
   ```bash
   npm start
   ```

4.Access the application
   Open your web browser and go to `http://localhost:3000`.

## Project Structure
The project structure is organized as follows:
- `/backend`: contains all the source code
- `/backend/routes`: defines all the express routes
- `/backend/controllers`: implement route handlers and business logic
- `/backend/models`: define mongoDB models
- `/backend/middleware`: all the middleware functions
- `/backend/config`: configuration files
- `/backend/views`: frontend pages for authentication

## Development Tips
- Use [Nodemon](https://nodemon.io/) to automatically restart the server during development:
```bash
npm install -g nodemon
nodemon
```

## Authentication
- `jsonwebtoken` is used for token based authentication.
- OAuth is implemented using `passport.js`
- Make sure to install [passport.js](https://www.passportjs.org/) 



# StackIt API

A simple REST API built with Express, TypeScript, and MongoDB.

## What's This?

This is a starter template for building Node.js APIs. It includes everything you need to get started: database connection, health check endpoints, and a clean folder structure.

## Getting Started

**1. Start MongoDB with Docker:**
```bash
docker-compose up -d
```

**2. Install packages:**
```bash
npm install
```

**3. Create a `.env` file:**
```env
PORT=3000
MONGODB_URI=mongodb://admin:password123@localhost:27017/stackit?authSource=admin
DB_NAME=stackit
API_VERSION=v1
```

**4. Start the server:**
```bash
npm run dev
```

That's it! Your API is now running at `http://localhost:3000`

**To stop MongoDB:**
```bash
docker-compose down
```

## Available Commands

- `npm run dev` - Start the server (auto-reloads when you change code)
- `npm run build` - Build for production
- `npm start` - Run the production build

## API Endpoints

Try these in your browser or Postman:

- **GET** `http://localhost:3000/` - Welcome message
- **GET** `http://localhost:3000/api/v1/health` - Check if the API is working
- **GET** `http://localhost:3000/api/v1/health/detailed` - See detailed server info

## Project Structure

```
src/
├── config/       # Settings (loads from .env)
├── database/     # MongoDB connection
├── routes/       # Your API endpoints
├── app.ts        # App setup
└── server.ts     # Starts the server
```

## Built With

- Express - Web framework
- TypeScript - JavaScript with types
- MongoDB & Mongoose - Database
- Docker - Container platform for MongoDB
- Node.js - Runtime environment

## Adding New Features

1. Create a new folder in `src/routes/` for your feature
2. Add your controller functions
3. Connect your routes in `src/routes/index.ts`

That's all you need to know to get started!
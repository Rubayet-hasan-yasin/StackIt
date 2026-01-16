# StackIt

A file management API built with Express, TypeScript, and MongoDB. Manage notes, images, PDFs, and folders with built-in storage tracking.

## Features

- 📝 Notes - Create and edit text notes
- 🖼️ Images - Upload images with automatic optimization
- 📄 PDFs - Store PDF documents (up to 10MB)
- 📁 Folders - Organize files in nested folders
- ⭐ Favorites - Mark important files
- 🔍 Search - Find files by name or content
- 💾 Storage - 15GB per user with automatic tracking
- 🔐 Auth - Email/password or Google OAuth

## Getting Started

**1. Install dependencies**
```bash
npm install
```

**2. Set up MongoDB**

You need MongoDB running locally or use MongoDB Atlas. Update the connection string in `.env`.

**3. Configure environment**

Copy `.env.example` to `.env` and update the values:

```env
PORT=3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```

**4. Run the server**
```bash
npm run dev
```

Server runs on `http://localhost:3000`

## API Testing

Import `StackIt-Public.postman_collection.json` into Postman:

1. Create environment with `baseUrl` = `http://localhost:3000`
2. Register: `POST /api/v1/auth/register`
3. Login: `POST /api/v1/auth/login` (token auto-saves)
4. Test other endpoints

## Main Endpoints

**Auth**
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Login and get token
- `POST /api/v1/auth/forgot-password` - Request OTP
- `POST /api/v1/auth/reset-password` - Reset with OTP

**Files**
- `GET /api/v1/files` - Get all files
- `DELETE /api/v1/files/:id` - Delete file

**Notes**
- `POST /api/v1/notes` - Create note
- `PUT /api/v1/notes/:id` - Update note
- `GET /api/v1/notes` - Get all notes

**Images**
- `POST /api/v1/images/upload` - Upload image
- `GET /api/v1/images` - Get all images

**PDFs**
- `POST /api/v1/pdfs/upload` - Upload PDF
- `GET /api/v1/pdfs` - Get all PDFs

**Folders**
- `POST /api/v1/folders` - Create folder
- `GET /api/v1/folders` - Get all folders
- `GET /api/v1/folders/:id/files` - Get files in folder

**Dashboard**
- `GET /api/v1/dashboard/summary` - Storage stats
- `GET /api/v1/dashboard/search` - Search files

## Project Structure

```
src/
├── modules/          # Feature modules (auth, files, folders, etc.)
├── shared/           # Middleware, types, utilities
├── config/           # Configuration and Passport strategies
├── database/         # MongoDB connection
└── routes/           # API routes
```

## Tech Stack

- Express + TypeScript
- MongoDB + Mongoose
- Passport.js + JWT
- Multer + Sharp (file handling)
- Zod (validation)

## Scripts

- `npm run dev` - Development mode
- `npm run build` - Build for production
- `npm start` - Run production build

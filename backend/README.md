# Movie App Backend

This is the backend server for the Movie Review Application. It provides RESTful APIs for user authentication, movie management, and user profile management.

## Features

- User authentication (register, login, logout)
- JWT-based authorization
- Movie CRUD operations
- User profile management
- Favorite movies functionality
- Movie reviews and ratings
- Admin-only routes for movie management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Movies
- GET `/api/movies` - Get all movies (with filtering and pagination)
- GET `/api/movies/:id` - Get single movie
- POST `/api/movies` - Create movie (admin only)
- PUT `/api/movies/:id` - Update movie (admin only)
- DELETE `/api/movies/:id` - Delete movie (admin only)
- POST `/api/movies/:id/favorite` - Add movie to favorites
- DELETE `/api/movies/:id/favorite` - Remove movie from favorites

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- PUT `/api/users/change-password` - Change password
- GET `/api/users/favorites` - Get user's favorite movies
- GET `/api/users/reviews` - Get user's reviews

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Input validation using express-validator
- Protected routes using middleware
- Role-based access control (admin/user)

## Error Handling

The API uses standard HTTP status codes and returns JSON responses with error messages when something goes wrong. 
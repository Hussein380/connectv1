# Scholars Connect Backend Documentation

## Overview
Scholars Connect is a platform connecting students (mentees) with experienced scholars (mentors) and providing access to educational opportunities. This documentation covers the backend implementation.

## Tech Stack
- Node.js & Express.js
- MongoDB with Mongoose
- JWT for Authentication
- bcryptjs for Password Hashing

## Project Structure

## API Endpoints

### 1. Authentication Routes (`/api/auth/`)
```javascript
POST /signup
// Register new user
Body: {
  name: string,
  email: string,
  password: string,
  role: "mentor" | "mentee"
}

POST /login
// Login user
Body: {
  email: string,
  password: string
}
```

### 2. Mentor Routes (`/api/mentor/`)
```javascript
GET /profile
// Get mentor profile
Headers: Authorization: Bearer <token>

PUT /profile
// Update mentor profile
Headers: Authorization: Bearer <token>
Body: {
  name?: string,
  email?: string,
  bio?: string,
  interests?: string[],
  password?: string
}

GET /opportunities
// Get mentor's posted opportunities
Headers: Authorization: Bearer <token>
```

### 3. Mentee Routes (`/api/mentee/`)
```javascript
GET /profile
// Get mentee profile
Headers: Authorization: Bearer <token>

PUT /profile
// Update mentee profile
Headers: Authorization: Bearer <token>
Body: {
  name?: string,
  email?: string,
  bio?: string,
  interests?: string[],
  password?: string
}

GET /search
// Search opportunities
Headers: Authorization: Bearer <token>
Query: {
  title?: string,
  eligibility?: string,
  deadline?: Date
}
```

### 4. Opportunity Routes (`/api/opportunities/`)
```javascript
POST /
// Create new opportunity (Mentor only)
Headers: Authorization: Bearer <token>
Body: {
  title: string,
  description: string,
  eligibility: string,
  deadline: Date,
  link: string
}

GET /
// Get all opportunities
No authentication required

GET /:id
// Get specific opportunity
No authentication required

PUT /:id
// Update opportunity (Mentor only)
Headers: Authorization: Bearer <token>
Body: {
  title?: string,
  description?: string,
  eligibility?: string,
  deadline?: Date,
  link?: string
}

DELETE /:id
// Delete opportunity (Mentor only)
Headers: Authorization: Bearer <token>
```

### 5. Mentorship Routes (`/api/mentorship/`)
```javascript
POST /request/:mentorId
// Create mentorship request (Mentee only)
Headers: Authorization: Bearer <token>
Body: {
  message: string
}

GET /requests
// Get mentorship requests (Mentor only)
Headers: Authorization: Bearer <token>

PUT /request/:requestId
// Update request status (Mentor only)
Headers: Authorization: Bearer <token>
Body: {
  status: "accepted" | "rejected"
}

GET /my-requests
// Get mentee's sent requests (Mentee only)
Headers: Authorization: Bearer <token>
```

## Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  role: String (enum: ['mentor', 'mentee']),
  bio: String,
  interests: [String],
  timestamps: true
}
```

### Opportunity Model
```javascript
{
  title: String (required),
  description: String (required),
  eligibility: String (required),
  deadline: Date (required),
  link: String (required),
  postedBy: ObjectId (ref: 'User'),
  timestamps: true
}
```

### MentorshipRequest Model
```javascript
{
  menteeId: ObjectId (ref: 'User'),
  mentorId: ObjectId (ref: 'User'),
  status: String (enum: ['pending', 'accepted', 'rejected']),
  message: String (required),
  timestamps: true
}
```

## Authentication
- JWT-based authentication
- Token expiration: 30 days
- Protected routes require Bearer token in Authorization header
- Role-based access control for mentor/mentee specific routes

## Error Handling
- Global error handler middleware
- Async error handling using express-async-handler
- Proper HTTP status codes and error messages

## Environment Variables
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Getting Started
1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`

3. Start development server:
```bash
npm run dev
```

4. For production:
```bash
npm start
```

This documentation should help frontend developers understand the API structure and available endpoints for integration.

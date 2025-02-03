# Scholars Connect Platform

A platform connecting students with mentors and educational opportunities.

## Features

### For Mentees (Students)
- Create and manage profile
- Search for opportunities (scholarships, fellowships, internships)
- Send mentorship requests
- Track request status

### For Mentors
- Create and manage profile
- Post and manage opportunities
- Accept/reject mentorship requests
- Track mentee interactions

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT Authentication
- RESTful API

### Frontend
- React with Vite
- Tailwind CSS
- Framer Motion
- Axios for API calls

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/scholars-connect.git
cd scholars-connect
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

4. Set up environment variables
Create .env file in backend directory:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Create .env file in frontend directory:
```
VITE_API_URL=http://localhost:5000/api
```

5. Start the servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

## API Documentation

### Authentication Routes
- POST /api/auth/signup - Register new user
- POST /api/auth/login - Login user

### User Routes
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile

### Opportunity Routes
- GET /api/opportunities - Get all opportunities
- POST /api/opportunities - Create new opportunity (Mentor only)
- PUT /api/opportunities/:id - Update opportunity
- DELETE /api/opportunities/:id - Delete opportunity

### Mentorship Routes
- POST /api/mentorship/request/:mentorId - Send mentorship request
- GET /api/mentorship/requests - Get mentorship requests
- PUT /api/mentorship/request/:requestId - Update request status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details 
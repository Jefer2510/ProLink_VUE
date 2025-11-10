# ProLink Backend API

Backend API for ProLink application built with Node.js and Express.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure your `.env` file with your database credentials and JWT secret.

## Database Setup

Create the database in MySQL:
```sql
CREATE DATABASE prolink_db;
```

## Running the Application

### Production mode:
```bash
npm start
```

### Development mode (with auto-reload):
```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your .env file).

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## Technologies Used

- **Express**: Web framework
- **MySQL2**: Database driver
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT authentication
- **dotenv**: Environment variables
- **cors**: Cross-origin resource sharing

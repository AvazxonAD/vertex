# Line Backend

Node.js backend server for Line project with Express.js, MySQL, and JWT authentication.

## Project Structure

```
line/
├── src/
│   ├── apps/           # Feature modules
│   │   ├── auth/       # Authentication module
│   │   └── index.js    # Route aggregator
│   ├── config/         # Configuration files
│   │   └── db/         # Database configuration
│   ├── middleware/     # Express middleware
│   ├── utils/          # Utility functions
│   └── server.js       # Application entry point
├── public/             # Static files
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore rules
└── package.json       # NPM dependencies
```

## Features

- ✅ Express.js server setup
- ✅ MySQL database integration
- ✅ JWT authentication system
- ✅ Input validation with express-validator
- ✅ Error handling middleware
- ✅ Response formatting middleware
- ✅ CORS and security headers
- ✅ Environment configuration
- ✅ Logging with Morgan
- ✅ Modular architecture

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`

5. Set up your MySQL database

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

## Environment Variables

See `.env.example` for all available configuration options.

## Database Schema

Create the following table in your MySQL database:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
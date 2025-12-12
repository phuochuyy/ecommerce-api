# E-commerce API

A REST API for an e-commerce application built with Node.js, Express, and Prisma ORM.

## Features

- User authentication with JWT
- Product management with CRUD operations
- Product filtering, search, and pagination
- Shopping cart functionality
- Admin role for product management
- Input validation and error handling
- CORS support

## Technology Stack

- Node.js with ES Modules
- Express.js
- PostgreSQL
- Prisma ORM
- JWT for authentication
- Docker and Docker Compose

## Prerequisites

- Node.js v18 or higher
- Docker and Docker Compose
- npm

## Getting Started

### Installation

Install dependencies:
```
npm install
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Database Setup

Start the PostgreSQL database:
```
docker compose up -d
```

Generate Prisma Client and run migrations:
```
npm run prisma:generate
npm run prisma:migrate
```

### Running the Server

Start the development server:
```
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- POST `/auth/register` - Register a new user
- POST `/auth/login` - Login user
- POST `/auth/logout` - Logout user

### Products

- GET `/products` - Get all products with optional filtering
- GET `/products/:id` - Get product by ID
- POST `/products` - Create product (Admin only)
- PUT `/products/:id` - Update product (Admin only)
- DELETE `/products/:id` - Delete product (Admin only)

### Cart

- GET `/cart` - Get user cart
- POST `/cart/items` - Add item to cart
- PUT `/cart/items/:productId` - Update cart item quantity
- DELETE `/cart/items/:productId` - Remove item from cart
- DELETE `/cart` - Clear cart

## Query Parameters

The products endpoint supports the following query parameters:

- `category` - Filter by category
- `search` - Search in product name or description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sort` - Sort field: id, name, price, rating, createdAt
- `order` - Sort order: asc or desc

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Project Structure

```
src/
├── config/          Configuration files
├── controllers/     HTTP request/response handlers
├── services/        Business logic layer
├── routes/          Route definitions
├── middleware/      Express middleware
├── utils/           Utility functions
└── server.js        Express server setup
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:deploy` - Deploy migrations (production)
- `npm run prisma:studio` - Open Prisma Studio

## Database

The database schema is defined in `prisma/schema.prisma`. The schema includes:

- User accounts with authentication
- Product catalog with full details
- Shopping cart items with relationships

## Error Handling

The API returns standardized error responses with appropriate HTTP status codes:

- 200 OK - Successful request
- 201 Created - Resource created
- 400 Bad Request - Invalid request data
- 401 Unauthorized - Authentication required
- 403 Forbidden - Insufficient permissions
- 404 Not Found - Resource not found
- 422 Unprocessable Entity - Validation errors
- 500 Internal Server Error - Server error

## Notes

- All prices are stored as integers (VND - Vietnamese Dong)
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Database migrations are managed by Prisma Migrate

## License

ISC

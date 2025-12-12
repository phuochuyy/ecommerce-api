# E-commerce API

A modern Node.js/Express REST API for an e-commerce application built with Prisma ORM and PostgreSQL.

## Features

- 🔐 JWT-based authentication (register, login, logout)
- 📦 Product management with CRUD operations
- 🔍 Advanced product filtering, search, and pagination
- 🛒 Shopping cart functionality
- 👑 Admin role for product management
- ✅ Input validation and comprehensive error handling
- 🌐 CORS support for frontend integration

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma 7
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Containerization:** Docker & Docker Compose

## Prerequisites

- Node.js v18 or higher
- Docker and Docker Compose
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (Prisma)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**Important:** Change `JWT_SECRET` to a secure random string in production!

### 3. Start Database

```bash
docker compose up -d
```

**Note:** If you get a permission denied error:
- Add your user to docker group: `sudo usermod -aG docker $USER` (then logout/login)
- Or use: `sudo docker compose up -d`

### 4. Setup Database

Generate Prisma Client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

When prompted for a migration name, enter: `init` or `create_initial_schema`

### 5. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/logout` | Logout user | Yes |

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products (with filters) | No |
| GET | `/products/:id` | Get product by ID | No |
| POST | `/products` | Create product | Admin |
| PUT | `/products/:id` | Update product | Admin |
| DELETE | `/products/:id` | Delete product | Admin |

### Cart

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/cart` | Get user cart | Yes |
| POST | `/cart/items` | Add item to cart | Yes |
| PUT | `/cart/items/:productId` | Update cart item quantity | Yes |
| DELETE | `/cart/items/:productId` | Remove item from cart | Yes |
| DELETE | `/cart` | Clear cart | Yes |

## Query Parameters

### Products Endpoint

- `category` - Filter by category (e.g., "electronics")
- `search` - Search in product name/description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sort` - Sort field: `id`, `name`, `price`, `rating`, `createdAt` (default: `id`)
- `order` - Sort order: `asc` or `desc` (default: `asc`)

**Example:**
```
GET /products?category=electronics&search=laptop&page=1&limit=20&sort=price&order=desc
```

## Authentication

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Creating an Admin User

After registering a user, connect to the database and update the role:

```bash
docker exec -it ecommerce-postgres psql -U postgres -d ecommerce
```

Then run:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Project Structure

```
ecommerce-api/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── config/
│   │   └── database.js        # Prisma client configuration
│   ├── controllers/           # HTTP request/response handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   └── cartController.js
│   ├── services/              # Business logic layer
│   │   ├── authService.js
│   │   ├── productService.js
│   │   └── cartService.js
│   ├── routes/                # Route definitions
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── cartRoutes.js
│   ├── middleware/            # Express middleware
│   │   ├── auth.js            # JWT authentication
│   │   ├── validation.js     # Input validation
│   │   └── errorHandler.js   # Error handling
│   ├── utils/                 # Utility functions
│   │   ├── constants.js       # App constants
│   │   ├── errors.js          # Custom error classes
│   │   └── helpers.js         # Helper functions
│   └── server.js              # Express server setup
├── docker-compose.yml         # PostgreSQL database setup
└── package.json
```

### Architecture

The project follows a **layered architecture** pattern:

- **Routes**: Define endpoints and call controllers
- **Controllers**: Handle HTTP requests/responses, call services
- **Services**: Contain business logic and database operations
- **Middleware**: Authentication, validation, and error handling
- **Utils**: Reusable helper functions and constants

This separation of concerns makes the codebase:
- ✅ More maintainable
- ✅ Easier to test
- ✅ More scalable
- ✅ Better organized

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Create and run database migrations (development)
- `npm run prisma:deploy` - Deploy migrations (production)
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Testing the API

### Using curl

```bash
# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get all products
curl http://localhost:3000/products

# Get products with filters
curl "http://localhost:3000/products?category=electronics&page=1&limit=10"

# Get product by ID
curl http://localhost:3000/products/1

# Add item to cart (requires authentication token)
curl -X POST http://localhost:3000/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"productId":1,"quantity":2}'
```

### Using Postman or Thunder Client

Import the API endpoints and test with the provided examples. Make sure to include the `Authorization: Bearer <token>` header for protected routes.

## Database Schema

The database schema is defined in `prisma/schema.prisma`:

- **User** - User accounts with authentication
- **Product** - Product catalog with full details
- **CartItem** - Shopping cart items with relationships

Prisma automatically handles:
- Type safety
- Database migrations
- Relationships and joins
- Indexes and constraints

## Error Handling

The API returns standardized error responses:

```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

### HTTP Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or invalid token
- `403 Forbidden` - Insufficient permissions (Admin required)
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

## Important Notes

- All prices are stored as integers (VND - Vietnamese Dong)
- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days (configurable via `JWT_EXPIRES_IN`)
- The API follows the specification in `docs/API_DOCUMENTATION.md`
- Database migrations are managed by Prisma Migrate

## Troubleshooting

### Database Connection Error

- Ensure Docker Compose is running: `docker compose ps`
- Check database logs: `docker compose logs postgres`
- Verify `DATABASE_URL` in `.env` file

### Port Already in Use

- Change the `PORT` in `.env` file
- Or stop the service using port 3000

### Migration Errors

- Ensure database is running: `docker compose up -d`
- Check `DATABASE_URL` in `.env`
- Reset database: `docker compose down -v && docker compose up -d`

### Prisma Client Not Generated

- Run: `npm run prisma:generate`
- Ensure Prisma schema is valid: `npx prisma validate`

## License

ISC

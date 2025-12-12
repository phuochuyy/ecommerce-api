# API Documentation

This document describes the API endpoints and data structures required by the front-end application. Back-end developers should implement these endpoints to ensure proper integration.

## Base URL

The front-end expects the API base URL to be configured via environment variable:

```
VITE_API_URL=https://api.example.com
```

If not set, the front-end will use mock data for development.

## Authentication

### Token-based Authentication

The front-end uses JWT (JSON Web Token) for authentication. After successful login/registration, the back-end should return a token that will be stored in localStorage and sent with subsequent requests.

**Token Storage:**
- Stored in `localStorage` with key `token`
- Sent in `Authorization` header as: `Bearer <token>`

**Token Format:**
```
Authorization: Bearer <jwt-token>
```

## API Endpoints

### Authentication Endpoints

#### 1. Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+1234567890",
    "address": "123 Main St"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password",
  "message": "The provided credentials are incorrect"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Validation error",
  "message": "Email is required"
}
```

---

#### 2. Register

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+1234567890"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Validation error",
  "message": "Email already exists"
}
```

**Validation Rules:**
- `name`: Required, min 2 characters
- `email`: Required, valid email format, unique
- `password`: Required, min 6 characters
- `phone`: Optional, valid phone format

---

#### 3. Logout

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### Product Endpoints

#### 4. Get All Products

**Endpoint:** `GET /products`

**Query Parameters (Optional):**
- `category` (string): Filter by category (e.g., "electronics", "clothing")
- `search` (string): Search term for product name/description
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Items per page (default: 20)
- `sort` (string): Sort field (e.g., "price", "rating", "name")
- `order` (string): Sort order ("asc" or "desc")

**Example:** `GET /products?category=electronics&search=laptop&page=1&limit=20`

**Response (200 OK):**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Laptop Dell XPS 15",
      "description": "Premium laptop with 15.6 inch Full HD display",
      "price": 24990000,
      "originalPrice": 29990000,
      "image": "https://example.com/images/laptop.jpg",
      "images": [
        "https://example.com/images/laptop-1.jpg",
        "https://example.com/images/laptop-2.jpg"
      ],
      "category": "electronics",
      "stock": 15,
      "rating": 4.5,
      "reviewCount": 234,
      "brand": "Dell",
      "isPrime": true,
      "discount": 17
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

#### 5. Get Product by ID

**Endpoint:** `GET /products/:id`

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Laptop Dell XPS 15",
  "description": "Premium laptop with 15.6 inch Full HD display, dedicated graphics card",
  "price": 24990000,
  "originalPrice": 29990000,
  "image": "https://example.com/images/laptop.jpg",
  "images": [
    "https://example.com/images/laptop-1.jpg",
    "https://example.com/images/laptop-2.jpg"
  ],
  "category": "electronics",
  "stock": 15,
  "rating": 4.5,
  "reviewCount": 234,
  "brand": "Dell",
  "isPrime": true,
  "discount": 17,
  "specifications": {
    "processor": "Intel Core i7",
    "ram": "16GB",
    "storage": "512GB SSD"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Product not found",
  "message": "Product with ID 1 does not exist"
}
```

---

#### 6. Create Product (Admin)

**Endpoint:** `POST /products`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 100000,
  "originalPrice": 120000,
  "image": "https://example.com/images/product.jpg",
  "images": ["https://example.com/images/product-1.jpg"],
  "category": "electronics",
  "stock": 50,
  "brand": "Brand Name",
  "isPrime": true,
  "discount": 17
}
```

**Response (201 Created):**
```json
{
  "id": 123,
  "name": "New Product",
  ...
}
```

---

#### 7. Update Product (Admin)

**Endpoint:** `PUT /products/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** (Same as Create, all fields optional)

**Response (200 OK):**
```json
{
  "id": 123,
  "name": "Updated Product",
  ...
}
```

---

#### 8. Delete Product (Admin)

**Endpoint:** `DELETE /products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Product deleted successfully"
}
```

---

### Cart Endpoints (Optional - Currently using localStorage)

The front-end currently stores cart data in localStorage. If you want to persist cart data on the server, implement these endpoints:

#### 9. Get User Cart

**Endpoint:** `GET /cart`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "items": [
    {
      "product": {
        "id": 1,
        "name": "Product Name",
        "price": 100000,
        "image": "https://example.com/image.jpg"
      },
      "quantity": 2
    }
  ],
  "totalItems": 2,
  "totalPrice": 200000
}
```

---

#### 10. Add Item to Cart

**Endpoint:** `POST /cart/items`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Response (200 OK):**
```json
{
  "message": "Item added to cart",
  "cart": {
    "items": [...],
    "totalItems": 2,
    "totalPrice": 200000
  }
}
```

---

#### 11. Update Cart Item Quantity

**Endpoint:** `PUT /cart/items/:productId`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200 OK):**
```json
{
  "message": "Cart updated",
  "cart": {...}
}
```

---

#### 12. Remove Item from Cart

**Endpoint:** `DELETE /cart/items/:productId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Item removed from cart"
}
```

---

#### 13. Clear Cart

**Endpoint:** `DELETE /cart`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Cart cleared"
}
```

---

## Data Types

### Product

```typescript
interface Product {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  stock: number
  rating: number
  reviewCount: number
  brand?: string
  isPrime?: boolean
  discount?: number
  specifications?: Record<string, any>
}
```

### User

```typescript
interface User {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
}
```

### Cart Item

```typescript
interface CartItem {
  product: Product
  quantity: number
}
```

---

## Error Handling

All error responses should follow this format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": {} // Optional additional error details
}
```

### HTTP Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

### Validation Errors (422)

```json
{
  "error": "Validation error",
  "message": "The request contains invalid data",
  "errors": {
    "email": ["Email is required", "Email must be valid"],
    "password": ["Password must be at least 6 characters"]
  }
}
```

---

## CORS Configuration

The back-end must allow CORS requests from the front-end origin:

```
Access-Control-Allow-Origin: http://localhost:5173 (development)
Access-Control-Allow-Origin: https://yourdomain.com (production)
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Request/Response Interceptors

The front-end uses Axios with the following interceptors:

### Request Interceptor
- Adds `Authorization: Bearer <token>` header if token exists in localStorage
- Sets `Content-Type: application/json` for POST/PUT requests

### Response Interceptor
- Handles 401 errors by clearing auth state and redirecting to login
- Extracts `data` from response (Axios wraps responses in `data` property)

---

## Environment Variables

The front-end expects these environment variables:

```env
VITE_API_URL=https://api.example.com
```

If `VITE_API_URL` is not set, the front-end will use mock data.

---

## Pagination

For endpoints that support pagination, use this format:

**Query Parameters:**
- `page`: Page number (1-indexed)
- `limit`: Items per page

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Rate Limiting

Consider implementing rate limiting for:
- Login attempts (prevent brute force)
- API requests per user/IP
- Registration attempts

---

## Security Recommendations

1. **Password Requirements:**
   - Minimum 6 characters (front-end validation)
   - Consider enforcing stronger requirements on back-end
   - Hash passwords using bcrypt or similar

2. **Token Security:**
   - Set appropriate expiration times
   - Implement token refresh mechanism
   - Use HTTPS in production

3. **Input Validation:**
   - Validate all inputs on back-end (don't trust front-end validation)
   - Sanitize user inputs
   - Use parameterized queries to prevent SQL injection

4. **Authentication:**
   - Implement proper session management
   - Handle token expiration gracefully
   - Provide clear error messages for auth failures

---

## Testing

The front-end includes mock implementations for development. To test with a real back-end:

1. Set `VITE_API_URL` environment variable
2. Ensure CORS is properly configured
3. Test all endpoints with proper authentication
4. Verify error handling works correctly

---

## Notes

- All prices are in VND (Vietnamese Dong) - integers representing the smallest currency unit
- Image URLs should be absolute URLs (full path)
- The front-end handles loading states and errors automatically
- All dates should be in ISO 8601 format
- Boolean values should be actual booleans, not strings

---

## Support

For questions or issues regarding API integration, please contact the front-end development team.


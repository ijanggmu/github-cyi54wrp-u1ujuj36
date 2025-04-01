# PMS (Point of Sale Management System) API Documentation

## Base URL
```
${NEXT_PUBLIC_API_URL}
```

## Authentication
All API requests require authentication using Bearer token. The token should be included in the Authorization header:
```
Authorization: Bearer <token>
```

## Common Response Format
All API responses follow this format:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ErrorResponse {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile

### Users Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Roles Management
- `GET /api/roles` - Get all roles
- `GET /api/roles/:id` - Get role by ID
- `POST /api/roles` - Create new role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

### Inventory Management
- `GET /api/inventory` - Get all inventory items
- `GET /api/inventory/:id` - Get inventory item by ID
- `POST /api/inventory` - Add new inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item
- `GET /api/inventory/stock` - Get stock levels
- `POST /api/inventory/stock/adjust` - Adjust stock levels

### Sales Management
- `GET /api/sales` - Get all sales
- `GET /api/sales/:id` - Get sale by ID
- `POST /api/sales` - Create new sale
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale
- `GET /api/sales/reports` - Get sales reports

### Orders Management
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order
- `DELETE /api/orders/:id` - Delete order
- `PUT /api/orders/:id/status` - Update order status

### Customers Management
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Suppliers Management
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get supplier by ID
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Reports
- `GET /api/reports/sales` - Get sales reports
- `GET /api/reports/inventory` - Get inventory reports
- `GET /api/reports/customers` - Get customer reports
- `GET /api/reports/suppliers` - Get supplier reports

### Settings
- `GET /api/settings` - Get system settings
- `PUT /api/settings` - Update system settings

## Error Handling
The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include:
- Error message
- HTTP status code
- Validation errors (if applicable)

## Rate Limiting
API requests are limited to 100 requests per minute per IP address.

## Pagination
List endpoints support pagination using query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field
- `order`: Sort order (asc/desc)

## WebSocket Events
Real-time updates are available through WebSocket connections:
- `inventory:update` - Inventory updates
- `sales:new` - New sales
- `orders:update` - Order status updates
- `notifications:new` - New notifications 
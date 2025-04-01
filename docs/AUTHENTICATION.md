# Authentication & Authorization

## Overview
This document defines the authentication and authorization standards for the API.

## Authentication Methods

### JWT Authentication
```typescript
interface JWTToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}
```

### Token Structure
```typescript
interface JWTPayload {
  sub: string;        // User ID
  email: string;      // User email
  roles: string[];    // User roles
  permissions: string[]; // User permissions
  iat: number;        // Issued at
  exp: number;        // Expiration time
  jti: string;        // JWT ID
}
```

## Authentication Endpoints

### Login
```typescript
POST /api/auth/login
Request:
{
  email: string;
  password: string;
}

Response:
{
  success: true;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
    user: User;
  };
}
```

### Refresh Token
```typescript
POST /api/auth/refresh
Request:
{
  refreshToken: string;
}

Response:
{
  success: true;
  data: {
    accessToken: string;
    expiresIn: number;
  };
}
```

### Logout
```typescript
POST /api/auth/logout
Request:
{
  refreshToken: string;
}

Response:
{
  success: true;
  message: 'Logged out successfully';
}
```

## Authorization

### Role-Based Access Control (RBAC)
```typescript
interface Role {
  id: string;
  name: string;
  permissions: string[];
  description?: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
}
```

### Role Hierarchy
- Super Admin
  - Admin
    - Manager
      - User

### Permission Categories
1. User Management
   - Create user
   - Read user
   - Update user
   - Delete user

2. Customer Management
   - Create customer
   - Read customer
   - Update customer
   - Delete customer

3. Inventory Management
   - Create product
   - Read product
   - Update product
   - Delete product
   - Manage stock

4. Order Management
   - Create order
   - Read order
   - Update order
   - Delete order

5. Reporting
   - Generate reports
   - View reports
   - Export reports

## Security Measures

### Password Requirements
- Minimum length: 8 characters
- Must contain:
  - Uppercase letters
  - Lowercase letters
  - Numbers
  - Special characters
- Maximum age: 90 days
- Password history: 5 passwords

### Token Security
- Access token expiration: 24 hours
- Refresh token expiration: 7 days
- Token rotation on refresh
- Single refresh token per session

### Session Management
- Device tracking
- Concurrent session limits
- Session timeout: 30 minutes
- Force logout capability

## Implementation

### Middleware
```typescript
interface AuthMiddleware {
  validateToken: (req: Request, res: Response, next: NextFunction) => void;
  checkPermission: (permission: string) => (req: Request, res: Response, next: NextFunction) => void;
  checkRole: (role: string) => (req: Request, res: Response, next: NextFunction) => void;
}
```

### Error Responses
```typescript
interface AuthError {
  code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'TOKEN_EXPIRED' | 'INVALID_TOKEN';
  message: string;
  details?: any;
}
```

## Testing

### Authentication Tests
- Login validation
- Token generation
- Token refresh
- Token validation
- Logout process

### Authorization Tests
- Role assignment
- Permission checking
- Access control
- Role hierarchy
- Permission inheritance

## Monitoring

### Security Logs
- Login attempts
- Failed authentications
- Token usage
- Permission changes
- Role changes

### Audit Trail
- User actions
- Permission changes
- Role changes
- Security events
- Access attempts 
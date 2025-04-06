# Supabase Integration Guide

## Prerequisites

- Node.js 18 or later
- npm or yarn
- Supabase account

## Setup Instructions

1. Create a new Supabase project:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Click "New Project"
   - Fill in project details and create

2. Get your project credentials:
   - Go to Project Settings > API
   - Copy the following values:
     - Project URL
     - anon/public key
     - service_role key

3. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in the Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The application uses the following tables:

### Profiles
- id (uuid, primary key)
- email (text)
- full_name (text)
- avatar_url (text)
- role_id (uuid, foreign key)
- created_at (timestamp)
- updated_at (timestamp)

### Roles
- id (uuid, primary key)
- name (text)
- description (text)
- permissions (jsonb)
- created_at (timestamp)

### Products
- id (uuid, primary key)
- name (text)
- description (text)
- sku (text)
- price (decimal)
- cost (decimal)
- stock_quantity (integer)
- category_id (uuid, foreign key)
- supplier_id (uuid, foreign key)
- created_at (timestamp)
- updated_at (timestamp)

### Orders
- id (uuid, primary key)
- customer_id (uuid, foreign key)
- status (text)
- total_amount (decimal)
- created_by (uuid, foreign key)
- created_at (timestamp)
- updated_at (timestamp)

### Order Items
- id (uuid, primary key)
- order_id (uuid, foreign key)
- product_id (uuid, foreign key)
- quantity (integer)
- unit_price (decimal)
- created_at (timestamp)

## Security Rules

Row Level Security (RLS) policies are implemented for all tables:

### Profiles
- Users can view their own profile
- Users can update their own profile
- Admins can view and update all profiles

### Products
- Authenticated users can view products
- Only admins can create, update, and delete products

### Orders
- Users can view their own orders
- Users can create new orders
- Only admins can update and delete orders

## Real-time Features

The application uses Supabase's real-time subscriptions for:

- Product inventory updates
- Order status changes
- New order notifications

## Best Practices

1. **Authentication**
   - Always use the `useAuth` hook for authentication state
   - Protect routes using the `ProtectedRoute` component
   - Implement proper error handling for auth operations

2. **Database Operations**
   - Use the provided database utility functions
   - Implement proper error handling
   - Use transactions for complex operations

3. **Real-time Updates**
   - Use the `useRealtime` hook for subscriptions
   - Clean up subscriptions when components unmount
   - Handle connection errors gracefully

4. **Security**
   - Never expose service role key in client-side code
   - Use RLS policies for data access control
   - Validate user input before database operations

## Error Handling

The application implements the following error handling strategies:

1. **Authentication Errors**
   - Display user-friendly error messages
   - Redirect to login page when session expires
   - Handle network errors gracefully

2. **Database Errors**
   - Log errors to console in development
   - Show user-friendly error messages
   - Implement retry logic for transient errors

3. **Real-time Errors**
   - Handle connection drops
   - Implement reconnection logic
   - Show connection status to users

## Testing

1. **Authentication Tests**
   - Test login/logout flows
   - Verify protected routes
   - Test session persistence

2. **Database Tests**
   - Test CRUD operations
   - Verify RLS policies
   - Test complex queries

3. **Real-time Tests**
   - Test subscription setup
   - Verify real-time updates
   - Test error handling

## Deployment

1. **Environment Setup**
   - Set up production environment variables
   - Configure CORS settings
   - Set up SSL certificates

2. **Database Migration**
   - Run migrations in production
   - Verify data integrity
   - Set up backups

3. **Monitoring**
   - Set up error tracking
   - Monitor performance
   - Track usage metrics 
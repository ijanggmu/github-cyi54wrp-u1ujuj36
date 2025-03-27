# PMS (Point of Sale System)

A modern, type-safe Point of Sale System built with Next.js, TypeScript, and React Query.

## Table of Contents
1. [Project Structure](#project-structure)
2. [State Management](#state-management)
3. [API Layer](#api-layer)
4. [Type System](#type-system)
5. [React Query Integration](#react-query-integration)
6. [Best Practices](#best-practices)
7. [Code Organization](#code-organization)
8. [Error Handling](#error-handling)
9. [Performance Optimization](#performance-optimization)
10. [Getting Started](#getting-started)

## Project Structure

```
pms/
├── app/
│   ├── features/           # Feature-based modules
│   │   ├── auth/          # Authentication feature
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── dashboard/     # Dashboard feature
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── types/
│   │       └── utils/
│   └── layout.tsx         # Root layout
├── lib/
│   ├── api/              # API related code
│   ├── store/            # Global state management
│   ├── query/            # React Query configuration
│   └── types/            # Shared types
└── components/           # Shared components
```

## State Management

### Zustand Store
The project uses Zustand for global state management with persistence and devtools.

```typescript
// Example usage in a component
import { useAppStore } from '@/lib/store';

function ThemeToggle() {
  const { theme, setTheme } = useAppStore();

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </button>
  );
}
```

Best Practices:
- Keep store slices small and focused
- Use TypeScript interfaces for state types
- Implement proper error handling in actions
- Use middleware (persist, devtools) for better debugging

## API Layer

### API Client
The project uses a type-safe API client built with Axios.

```typescript
// Example usage in a component
import { apiClient } from '@/lib/api/client';

// GET request
const getUsers = async () => {
  const response = await apiClient.get<User[]>('/users');
  return response.data;
};

// POST request
const createUser = async (userData: CreateUserDTO) => {
  const response = await apiClient.post<User>('/users', userData);
  return response.data;
};
```

Best Practices:
- Always type your API responses
- Use proper error handling
- Implement request/response interceptors
- Keep API calls in service files

## Type System

### Shared Types
The project uses TypeScript with strict type checking.

```typescript
// Example of using shared types
import { User, ApiResponse, PaginatedResponse } from '@/lib/types';

interface UserListProps {
  users: User[];
  pagination: PaginatedResponse<User>['pagination'];
}
```

Best Practices:
- Use interfaces for object types
- Use type aliases for union types
- Keep types DRY (Don't Repeat Yourself)
- Use proper type guards

## React Query Integration

### Query Client Configuration
```typescript
// Example usage in a component
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

function UserList() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get<User[]>('/users'),
  });

  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserDTO) => 
      apiClient.post<User>('/users', userData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

Best Practices:
- Use proper query keys
- Implement proper error handling
- Use optimistic updates when appropriate
- Implement proper loading states

## Best Practices

### Component Structure
```typescript
// Example of a well-structured component
import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { User } from '@/lib/types';

interface UserListProps {
  limit?: number;
}

export const UserList: FC<UserListProps> = ({ limit = 10 }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', limit],
    queryFn: () => apiClient.get<User[]>(`/users?limit=${limit}`),
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
```

### Error Handling
```typescript
// Example of proper error handling
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

// Usage
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <UserList />
</ErrorBoundary>
```

## Code Organization

### Feature-Based Structure
Each feature should follow this structure:
```
feature/
├── components/     # Feature-specific components
├── hooks/         # Custom hooks
├── types/         # Feature-specific types
└── utils/         # Utility functions
```

### Naming Conventions
- Components: PascalCase (e.g., `UserList.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useUserData.ts`)
- Types: PascalCase (e.g., `UserTypes.ts`)
- Utils: camelCase (e.g., `formatDate.ts`)

## Performance Optimization

### React Query Best Practices
```typescript
// Example of optimized query configuration
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: () => apiClient.get<User[]>('/users'),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
  refetchOnWindowFocus: false,
});
```

### Component Optimization
```typescript
// Example of memoized component
import { memo } from 'react';

export const UserCard = memo(function UserCard({ user }: UserCardProps) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});
```

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://your-api-url
```

4. Run the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

6. Start the production server:
```bash
npm run start
```

## Development Guidelines

1. **Type Safety**
   - Always use TypeScript types
   - Avoid using `any`
   - Use proper type guards

2. **State Management**
   - Use Zustand for global state
   - Use React Query for server state
   - Use local state for component-specific state

3. **API Calls**
   - Use the API client for all HTTP requests
   - Implement proper error handling
   - Use React Query for data fetching

4. **Component Structure**
   - Keep components small and focused
   - Use proper prop types
   - Implement proper error boundaries

5. **Code Quality**
   - Follow ESLint rules
   - Write meaningful comments
   - Keep code DRY

6. **Testing**
   - Write unit tests for components
   - Write integration tests for features
   - Use proper test utilities

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
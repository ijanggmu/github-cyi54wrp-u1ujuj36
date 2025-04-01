# Supplier Management Module

## Overview
The Supplier Management module handles all supplier-related operations including supplier profiles, purchase orders, payments, and supplier communication.

## Data Models

### Supplier Model
```typescript
interface Supplier {
  id: string;
  supplierNumber: string;
  name: string;
  type: 'manufacturer' | 'distributor' | 'wholesaler' | 'retailer';
  status: 'active' | 'inactive' | 'blocked';
  contactPerson: string;
  email: string;
  phone: string;
  taxId: string;
  paymentTerms: string;
  creditLimit: number;
  currentBalance: number;
  addresses: SupplierAddress[];
  bankDetails: BankDetails;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  lastOrderDate?: Date;
  totalOrders: number;
  totalPurchases: number;
}
```

### SupplierAddress Model
```typescript
interface SupplierAddress {
  id: string;
  supplierId: string;
  type: 'billing' | 'shipping' | 'both';
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  notes?: string;
}
```

### BankDetails Model
```typescript
interface BankDetails {
  id: string;
  supplierId: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  routingNumber: string;
  swiftCode?: string;
  iban?: string;
  isDefault: boolean;
  notes?: string;
}
```

### PurchaseOrder Model
```typescript
interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  userId: string;
  date: Date;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  expectedDeliveryDate: Date;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  items: PurchaseOrderItem[];
  payments: Payment[];
  receipts: Receipt[];
}
```

### PurchaseOrderItem Model
```typescript
interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
  notes?: string;
}
```

### Receipt Model
```typescript
interface Receipt {
  id: string;
  purchaseOrderId: string;
  receiptNumber: string;
  date: Date;
  status: 'pending' | 'completed' | 'cancelled';
  items: ReceiptItem[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### ReceiptItem Model
```typescript
interface ReceiptItem {
  id: string;
  receiptId: string;
  purchaseOrderItemId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}
```

## API Endpoints

### Supplier Endpoints
1. Supplier Management
   - [ ] `GET /api/suppliers`
     - Pagination implementation
     - Search functionality
     - Status filtering
     - Type filtering
     - Date range filtering
   
   - [ ] `GET /api/suppliers/:id`
     - Supplier details
     - Order history
     - Payment history
     - Address list
   
   - [ ] `POST /api/suppliers`
     - Input validation
     - Email uniqueness check
     - Phone validation
     - Tax ID validation
   
   - [ ] `PUT /api/suppliers/:id`
     - Profile updates
     - Status changes
     - Credit limit updates
   
   - [ ] `DELETE /api/suppliers/:id`
     - Soft delete implementation
     - Related data cleanup
     - Order history preservation

### Purchase Order Endpoints
1. Purchase Order Management
   - [ ] `GET /api/purchase-orders`
     - Pagination implementation
     - Status filtering
     - Supplier filtering
     - Date range filtering
     - Search functionality
   
   - [ ] `GET /api/purchase-orders/:id`
     - Order details with items
     - Payment history
     - Receipt history
   
   - [ ] `POST /api/purchase-orders`
     - Stock validation
     - Price calculation
     - Supplier validation
     - Payment processing
   
   - [ ] `PUT /api/purchase-orders/:id`
     - Status updates
     - Item modifications
     - Delivery date updates
   
   - [ ] `DELETE /api/purchase-orders/:id`
     - Cancellation handling
     - Stock reversal
     - Payment reversal

### Receipt Endpoints
1. Receipt Management
   - [ ] `GET /api/purchase-orders/:id/receipts`
     - Receipt history
     - Receipt details
     - Status updates
   
   - [ ] `POST /api/purchase-orders/:id/receipts`
     - Receipt creation
     - Stock updates
     - Payment updates
   
   - [ ] `PUT /api/purchase-orders/:id/receipts/:receiptId`
     - Receipt updates
     - Status changes
     - Item modifications

## Database Operations

### Supplier Operations
- [ ] Create supplier table with indexes
  - Primary key index
  - Supplier number unique index
  - Email unique index
  - Phone index
  - Status index
  - Type index

- [ ] Create supplier address table
  - Primary key index
  - Supplier ID foreign key
  - Type index
  - Default flag index

- [ ] Create bank details table
  - Primary key index
  - Supplier ID foreign key
  - Default flag index

### Purchase Order Operations
- [ ] Create purchase order table
  - Primary key index
  - Order number unique index
  - Supplier foreign key index
  - User foreign key index
  - Date index
  - Status index

- [ ] Create purchase order items table
  - Primary key index
  - Purchase order ID foreign key
  - Product ID foreign key
  - Status index

### Receipt Operations
- [ ] Create receipt table
  - Primary key index
  - Receipt number unique index
  - Purchase order ID foreign key
  - Date index
  - Status index

- [ ] Create receipt items table
  - Primary key index
  - Receipt ID foreign key
  - Purchase order item ID foreign key

## Business Logic

### Supplier Processing
- [ ] Supplier creation
  - Number generation
  - Email validation
  - Phone validation
  - Tax ID validation
  - Credit limit setup

- [ ] Supplier updates
  - Profile updates
  - Status changes
  - Credit limit updates
  - Payment terms updates

### Purchase Order Processing
- [ ] Order creation
  - Number generation
  - Price calculation
  - Supplier validation
  - Stock validation

- [ ] Order management
  - Status transitions
  - Stock updates
  - Payment processing
  - Receipt handling

### Receipt Processing
- [ ] Receipt handling
  - Number generation
  - Stock updates
  - Payment updates
  - Status management

## Validation Rules

### Supplier Validation
- [ ] Profile rules
  - Name validation
  - Email format
  - Phone format
  - Tax ID format
  - Credit limit validation

- [ ] Status rules
  - Status transitions
  - Blocking conditions
  - Reactivation rules

### Purchase Order Validation
- [ ] Order rules
  - Number generation
  - Status transitions
  - Supplier validation
  - Payment validation

- [ ] Item rules
  - Stock validation
  - Price validation
  - Quantity validation
  - Discount limits

### Receipt Validation
- [ ] Receipt rules
  - Number generation
  - Status transitions
  - Quantity validation
  - Price validation

## Error Handling

### Supplier Errors
- [ ] Validation errors
  - Required fields
  - Format errors
  - Uniqueness errors
  - Status errors

- [ ] Business errors
  - Active orders
  - Blocked status
  - Credit limit exceeded

### Purchase Order Errors
- [ ] Validation errors
  - Required fields
  - Stock availability
  - Price validation
  - Supplier validation

- [ ] Business errors
  - Payment processing
  - Receipt processing
  - Status transitions

## Testing Requirements

### Unit Tests
- [ ] Supplier service tests
  - CRUD operations
  - Profile management
  - Status handling
  - Validation

- [ ] Purchase order service tests
  - CRUD operations
  - Price calculations
  - Stock management
  - Status handling

### Integration Tests
- [ ] API endpoint tests
  - Supplier creation flow
  - Purchase order flow
  - Receipt processing flow
  - Error scenarios

### Business Logic Tests
- [ ] Calculation tests
  - Price calculations
  - Tax calculations
  - Discount handling
  - Total calculations

## Documentation Requirements

### API Documentation
- [ ] Endpoint documentation
  - Request/response formats
  - Validation rules
  - Error responses
  - Example requests

### Business Logic Documentation
- [ ] Supplier processing
  - Profile management
  - Status handling
  - Credit management
  - Payment handling

### Data Model Documentation
- [ ] Schema documentation
  - Table relationships
  - Index usage
  - Constraint rules
  - Data types 
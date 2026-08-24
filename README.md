# Smart Restaurant Management System

A full-stack restaurant management system built using React.js, Node.js, Express.js, and PostgreSQL. The application provides menu browsing, search and category filtering, shopping cart management, order placement, and admin order management.

## Features

- Menu management with CRUD operations
- Category-based menu filtering
- Menu search functionality
- Dynamic menu rendering
- Shopping cart management
- Increase/decrease item quantity
- Remove items from cart
- Cart total calculation
- Customer and table details during checkout
- Order placement and persistence
- Admin order management
- Display of order items grouped by order
- Order status management
- Order status workflow:
  - Pending
  - Preparing
  - Ready
  - Completed
- Backend validation of menu prices
- RESTful APIs
- PostgreSQL database transactions
- API testing using Postman

## Tech Stack

### Frontend

- React.js
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- RESTful APIs

### Database

- PostgreSQL

### API Testing

- Postman

## Application Workflow

```text
Customer
   ↓
Browse Menu
   ↓
Search / Filter
   ↓
Add Items to Cart
   ↓
Manage Cart
   ↓
Checkout
   ↓
Place Order
   ↓
Express.js API
   ↓
PostgreSQL
   ↓
Admin Orders
   ↓
Update Order Status

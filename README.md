# Shelf Life

A web application for tracking expiry dates of items in your home. Keep track of food items, medications, and other perishables with customisable labels and notifications.

## Features

- Track items with expiry dates
- Customisable label system for organisation
- Quantity management
- Notes and descriptions for items

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Mantine UI
- React Query (TanStack Query)
- React Router
- Axios

### Backend

- Node.js
- Express
- JWT Authentication

## Project Structure

```
├── client/ Frontend application
│ ├── src/
│ │ ├── api/ # API integration
│ │ ├── components/ # Reusable components
│ │ ├── modals/ # Modal components
│ │ ├── routes/ # Route components
│ │ └── App.tsx # Main application component
│ │
│ └── package.json # Frontend dependencies
│
└── server/ # Backend application
    ├── api/ # API routes
    ├── data/ # Mock database
    └── package.json # Backend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository
2. Install frontend dependencies:

```bash
cd client
npm install
```

3. Install backend dependencies:

```bash
cd server
npm install
```

4. Start the backend server:

```bash
cd server
npm start
```

5. Start the frontend application:

```bash
bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173` with the backend running on `http://localhost:3000`.

## API Endpoints

### Authentication

- POST `/signIn` - Sign in with email and password
- GET `/welcome` - Test authenticated endpoint

### Items

- GET `/items` - Get all items
- GET `/items/:id` - Get specific item
- POST `/items` - Create new item
- PUT `/items/:id` - Update item
- DELETE `/items/:id` - Delete item

### Labels

- GET `/labels` - Get all labels
- GET `/labels/:id` - Get specific label
- POST `/labels` - Create new label
- PUT `/labels/:id` - Update label
- DELETE `/labels/:id` - Delete label

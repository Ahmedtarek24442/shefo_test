# Paper Carton Management System - Frontend

This is the frontend application for the Paper Carton Management System, built using modern React, Vite, and Tailwind CSS. It is designed specifically for Arabic RTL (Right-to-Left) layouts to provide an intuitive user experience for factory managers.

## Technologies Used
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Vanilla utilities)
- **Icons:** Lucide React
- **Charts:** Recharts
- **HTTP Client:** Axios (with centralized interceptors)
- **Routing:** React Router DOM
- **Notifications:** Sonner

## Project Structure
```text
src/
├── app/
│   ├── components/      # Reusable UI components (Layout, Modal, Navbar, Sidebar)
│   └── pages/           # Main application views (Dashboard, Customers, Orders, etc.)
├── context/
│   └── AuthContext.tsx  # Global authentication state management
├── services/
│   └── api.ts           # Axios instance with JWT interceptors
├── main.tsx             # Application entry point
└── App.tsx              # Main App component with routing setup
```

## Getting Started

### Prerequisites
Make sure you have Node.js (v18 or higher) installed.

### Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running in Development
Start the Vite development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

### Environment Variables
By default, the `api.ts` service connects to the backend at `http://localhost:3000/api`. If you deploy the backend to a different URL, update the `baseURL` inside `src/services/api.ts` or set an environment variable.

## State Management & API
The frontend relies heavily on direct API communication instead of complex local state management like Redux. 
- **Axios Interceptors** (`src/services/api.ts`): Automatically attach the `Bearer <token>` to all outgoing requests. They also handle `401 Unauthorized` errors by clearing local storage and redirecting the user to the login screen.
- Loading states are managed locally at the component level to render smooth skeleton or loading indicators.
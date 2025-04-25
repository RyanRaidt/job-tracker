# Job Tracker Application

A full-stack application for tracking job applications, built with React, Node.js, and PostgreSQL.

## Features

- User authentication with JWT
- Job application tracking
- LinkedIn job data integration
- Responsive design
- Dark/Light mode

## Tech Stack

### Frontend

- React
- Vite
- Chakra UI
- React Query
- React Router

### Backend

- Node.js
- Express
- PostgreSQL
- Prisma
- Passport.js
- JWT

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- LinkedIn Developer account (for job data integration)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/job_tracker"

# JWT
JWT_SECRET="your-jwt-secret-here"

# CORS
CORS_ORIGIN="http://localhost:5173"

# LinkedIn API
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
LINKEDIN_CALLBACK_URL="http://localhost:3000/api/auth/linkedin/callback"
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   npx prisma migrate dev
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CORS_ORIGIN`
   - `LINKEDIN_CLIENT_ID`
   - `LINKEDIN_CLIENT_SECRET`
   - `LINKEDIN_CALLBACK_URL`

### Frontend (Netlify)

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Set the build command to:
   ```bash
   npm run build
   ```
4. Set the publish directory to:
   ```
   dist
   ```

## License

MIT

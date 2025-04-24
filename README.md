# Developer Job Tracker

A full-stack application to track your job applications, built with Express, Prisma, PostgreSQL, and React.

## Features

- Add, edit, and delete job applications
- Store company information and application status
- Auto-populate data from LinkedIn job URLs
- Sort and filter applications by status or date
- Modern React frontend with Tailwind CSS
- Secure authentication system

## Tech Stack

### Backend

- Node.js with Express
- Prisma ORM
- PostgreSQL database
- Cheerio for web scraping

### Frontend

- React with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/job_tracker?schema=public"
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET="your-session-secret-here"
   ```

4. Create a `.env` file in the frontend directory:

   ```
   VITE_API_URL=http://localhost:3000
   ```

5. Create the database:

   ```bash
   createdb job_tracker
   ```

6. Run Prisma migrations:

   ```bash
   npx prisma migrate dev
   ```

7. Start the development servers:

   ```bash
   # Start backend (from root directory)
   npm run dev

   # Start frontend (from frontend directory)
   cd frontend
   npm run dev
   ```

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables:
   - `DATABASE_URL` (from Render PostgreSQL)
   - `PORT=3000`
   - `NODE_ENV=production`
   - `SESSION_SECRET`

### Frontend (Netlify)

1. Create a new site on Netlify
2. Connect your GitHub repository
3. Configure the build:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variable:
   - `VITE_API_URL` (your Render backend URL)

## API Endpoints

- `GET /api/jobs` - Get all job applications
  - Query parameters:
    - `status`: Filter by status (applied, interview, rejected)
    - `sortBy`: Sort by date (use value "date")
- `POST /api/jobs` - Create a new job application
- `PUT /api/jobs/:id` - Update a job application
- `DELETE /api/jobs/:id` - Delete a job application
- `POST /api/scrape-linkedin` - Scrape job data from LinkedIn URL

## Development

- The application uses Prisma as the ORM
- Express.js for the backend API
- PostgreSQL as the database
- Cheerio for web scraping LinkedIn job data
- React with Vite for the frontend
- Tailwind CSS for styling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

# Developer Job Tracker

A Node.js application to track your job applications, built with Express, Prisma, and PostgreSQL.

## Features

- Add, edit, and delete job applications
- Store company information and application status
- Auto-populate data from LinkedIn job URLs
- Sort and filter applications by status or date

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/job_tracker?schema=public"
   PORT=3000
   ```

4. Create the database:

   ```bash
   createdb job_tracker
   ```

5. Run Prisma migrations:

   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

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

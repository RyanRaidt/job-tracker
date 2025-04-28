# Job Tracker Application

A modern, full-stack application for tracking job applications and managing your job search process. Built with React, Node.js, and PostgreSQL, this application helps job seekers organize their applications and track their progress.

## Features

- 🔐 Secure user authentication with JWT
- 📊 Comprehensive job application tracking
- 🌓 Dark/Light mode support
- 📱 Responsive design for all devices
- 📈 Application status tracking
- 📝 Notes and reminders for each application
- 📅 Interview scheduling and reminders
- 📊 Analytics dashboard

## Tech Stack

### Frontend

- React 18.2.0
- Vite 5.1.0
- Chakra UI 2.8.2
- React Query 5.22.2
- React Router 6.22.1
- React Icons 5.0.1
- Framer Motion 11.0.5
- Axios 1.6.7

### Backend

- Node.js 18.x
- Express 4.18.2
- PostgreSQL 15.x
- Prisma 5.10.0
- Passport.js 0.7.0
- JWT 9.0.2
- Bcrypt 5.1.1
- Express Rate Limit 7.1.5

## Project Structure

```
job-tracker/
├── frontend/           # React frontend application
├── src/               # Backend source code
├── prisma/           # Database schema and migrations
├── package.json      # Backend dependencies
└── render.yaml       # Deployment configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (v15 or higher)
- Git

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/job_tracker"

# JWT
JWT_SECRET="your-jwt-secret-here"

# CORS
CORS_ORIGIN="http://localhost:5173"
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/job-tracker.git
   cd job-tracker
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Set up the database:

   ```bash
   cd ..
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. Start the development servers:

   ```bash
   # Start backend server (from root directory)
   npm run dev

   # Start frontend server (from frontend directory)
   cd frontend
   npm run dev
   ```

The application should now be running at:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Available Scripts

### Backend

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations

### Frontend

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Development Workflow

1. Create a new branch for your feature:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:

   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

3. Push your changes and create a pull request

## Troubleshooting

### Common Issues

1. **Database Connection Issues**

   - Ensure PostgreSQL is running
   - Verify DATABASE_URL in .env file
   - Check database user permissions

2. **Build Issues**
   - Clear node_modules and reinstall:
     ```bash
     rm -rf node_modules
     npm install
     ```
   - Clear cache:
     ```bash
     npm cache clean --force
     ```

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CORS_ORIGIN`
4. Set build command: `npm install && npm run prisma:generate && npm run prisma:migrate`
5. Set start command: `npm start`

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
5. Add environment variables for API endpoints

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request


## Support

If you encounter any issues or have questions, please:

1. Check the [troubleshooting](#troubleshooting) section
2. Search existing [issues](https://github.com/yourusername/job-tracker/issues)
3. Create a new issue if needed

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [Chakra UI](https://chakra-ui.com/)
- [Vite](https://vitejs.dev/)
- [React Query](https://tanstack.com/query/latest)

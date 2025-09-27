# Fileaty - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- MySQL database
- AWS account with S3 access

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Fileaty
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=fileaty_db

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret

# Server Configuration
PORT=3000

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```

### 4. Set Up the Database

Make sure your MySQL server is running, then create the database:

```sql
CREATE DATABASE fileaty_db;
```

Then run the database schema:

```sql
USE fileaty_db;
SOURCE database/schema.sql;
```

Alternatively, you can run the database initialization script:

```bash
npm run init-db
```

### 5. Configure AWS S3

1. Create an S3 bucket in your AWS account
2. Create an IAM user with S3 permissions
3. Update the `.env` file with your AWS credentials

### 6. Start the Application

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Database Schema

The database schema includes three main tables:

### Users Table
Stores user information including username, email, password hash, and role.

### Files Table
Stores file metadata including original name, size, MIME type, S3 URL, and reference to the uploader.

### Comments Table
Stores comments linked to files and users.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login

### Files
- `GET /api/files` - Get all files
- `GET /api/files/:id` - Get a specific file
- `POST /api/files/upload` - Upload a file
- `GET /api/files/:id/download` - Download a file
- `DELETE /api/files/:id` - Delete a file (admin or owner)

### Comments
- `GET /api/comments/file/:fileId` - Get comments for a file
- `POST /api/comments/file/:fileId` - Add a comment to a file
- `DELETE /api/comments/:id` - Delete a comment (admin or owner)

## User Roles

- **Admin**: Can upload, download, delete any file, and delete any comment
- **User**: Can upload, download files, and manage their own files/comments

## Frontend Pages

- `/` - Home page
- `/login.html` - Login page
- `/register.html` - Registration page
- `/dashboard.html` - File management dashboard

## Testing

Run the test suite:
```bash
npm test
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your database credentials in the `.env` file
   - Ensure your MySQL server is running

2. **AWS S3 Access Denied**
   - Verify your AWS credentials
   - Check that your IAM user has the correct S3 permissions

3. **Port Already in Use**
   - Change the PORT value in your `.env` file

### Need Help?

If you encounter any issues, please check the console logs for error messages or contact the development team.
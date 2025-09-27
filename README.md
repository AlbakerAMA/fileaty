# Fileaty - File Management System

A full-stack file management application with user authentication, file storage on AWS S3, and commenting features.

## Features

- User authentication (register/login)
- Role-based access control (Admin/User)
- File upload and storage on AWS S3
- File browsing and search
- File commenting system
- Admin controls for file management

## Tech Stack

### Backend
- Node.js with Express.js
- MySQL database with Sequelize ORM
- AWS S3 for file storage
- JWT for authentication

### Frontend
- HTML, CSS, JavaScript
- Axios for API calls

## Project Structure

```
fileaty/
├── config/
│   └── db.config.js          # Database configuration
├── controllers/
│   ├── auth.controller.js    # Authentication controller
│   ├── file.controller.js    # File management controller
│   └── comment.controller.js # Comment management controller
├── database/
│   └── schema.sql            # Database schema
├── middleware/
│   └── auth.middleware.js    # Authentication middleware
├── models/
│   ├── index.js              # Model associations
│   ├── user.model.js         # User model
│   ├── file.model.js         # File model
│   └── comment.model.js      # Comment model
├── routes/
│   ├── auth.routes.js        # Authentication routes
│   ├── file.routes.js        # File management routes
│   └── comment.routes.js     # Comment management routes
├── utils/
│   └── s3.utils.js           # AWS S3 utilities
├── public/
│   ├── index.html            # Home page
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── dashboard.html        # Dashboard page
│   ├── styles/
│   │   └── main.css          # Main stylesheet
│   └── js/
│       ├── main.js           # Main JavaScript
│       ├── auth.js           # Authentication JavaScript
│       └── dashboard.js      # Dashboard JavaScript
├── migrations/
│   └── init-db.js            # Database initialization script
├── tests/
│   └── api.test.js           # API tests
├── .env                      # Environment variables
├── server.js                 # Main server file
├── README.md                 # Project documentation
├── SETUP.md                  # Setup instructions
└── package.json              # Project dependencies
```

## Setup Instructions

For detailed setup instructions, please refer to [SETUP.md](SETUP.md).

### Quick Start

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Set up your environment variables in `.env`:
   ```
   DB_HOST=localhost
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=fileaty_db
   JWT_SECRET=your_jwt_secret
   PORT=3000
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET_NAME=your_s3_bucket_name
   ```

4. Create the database in MySQL and run the schema:
   ```sql
   CREATE DATABASE fileaty_db;
   USE fileaty_db;
   SOURCE database/schema.sql;
   ```

5. Start the server:
   ```
   npm start
   ```

   For development with auto-reload:
   ```
   npm run dev
   ```

## Database Schema

The database schema is defined in [database/schema.sql](database/schema.sql) and includes:

### Users Table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- username (VARCHAR(255), UNIQUE, NOT NULL)
- email (VARCHAR(255), UNIQUE, NOT NULL)
- password (VARCHAR(255), NOT NULL)
- role (ENUM: 'admin', 'user', DEFAULT 'user')
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### Files Table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- filename (VARCHAR(255), NOT NULL) - S3 key
- originalName (VARCHAR(255), NOT NULL) - Original file name
- size (INT, NOT NULL) - File size in bytes
- mimeType (VARCHAR(255), NOT NULL) - MIME type
- url (TEXT, NOT NULL) - S3 URL
- uploaderId (INT, FOREIGN KEY REFERENCES Users.id, NOT NULL)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### Comments Table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- content (TEXT, NOT NULL)
- fileId (INT, FOREIGN KEY REFERENCES Files.id, NOT NULL)
- userId (INT, FOREIGN KEY REFERENCES Users.id, NOT NULL)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

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

## Role-Based Access Control

- **Admin**: Can upload, download, delete any file, and delete any comment
- **User**: Can upload, download files, and manage their own files/comments

## AWS S3 Configuration

1. Create an AWS account
2. Create an S3 bucket
3. Create IAM credentials with S3 access
4. Update the `.env` file with your AWS credentials

## Testing

Run the test suite:
```
npm test
```

## Future Enhancements

- File search and filtering
- File sharing permissions
- User profile management
- Enhanced admin dashboard
- File preview for common file types
- Notifications system
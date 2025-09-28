# Deploying Fileaty Backend to Vercel

This guide explains how to deploy the Fileaty backend to Vercel.

## Prerequisites

1. A Vercel account
2. A MySQL database (you can use a service like PlanetScale, Railway, or any MySQL provider)
3. An AWS account with S3 access

## Deployment Steps

### 1. Prepare Your Repository

Make sure your repository includes all necessary files:
- `server.js` (main entry point)
- `vercel.json` (Vercel configuration)
- All routes, controllers, models, etc.

### 2. Set Up Environment Variables in Vercel

In your Vercel project settings, add the following environment variables:

```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_secure_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```

### 3. Configure Your Database

You'll need to set up a MySQL database. You can use services like:
- PlanetScale (serverless MySQL)
- Railway
- AWS RDS
- DigitalOcean Database

Make sure to run the database schema:
```sql
CREATE DATABASE fileaty_db;
USE fileaty_db;
SOURCE database/schema.sql;
```

### 4. Deploy to Vercel

You can deploy in two ways:

#### Option 1: Using Vercel CLI
```bash
npm install -g vercel
vercel
```

#### Option 2: Connect GitHub Repository
1. Push your code to GitHub
2. Go to Vercel dashboard
3. Click "New Project"
4. Import your repository
5. Configure the project with the environment variables
6. Deploy

### 5. Update Frontend Configuration

After deployment, update your frontend to point to the Vercel URL instead of localhost.

In your frontend `config.js` file:
```javascript
// Replace with your actual Vercel backend URL
const API_BASE_URL = 'https://your-fileaty-backend.vercel.app';

window.API_CONFIG = {
    BASE_URL: API_BASE_URL
};
```

## Important Notes

1. **Database Connection**: Vercel serverless functions have a short lifespan, so make sure your database connection is properly configured for serverless environments.

2. **File Storage**: Files are stored in AWS S3, which works well with Vercel deployments.

3. **CORS**: The application already includes CORS middleware, which should handle cross-origin requests from your frontend.

4. **Environment Variables**: Never commit your actual environment variables to the repository. Use the `.env.example` file as a template.

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your database credentials in Vercel environment variables
   - Ensure your database allows connections from Vercel IPs

2. **AWS S3 Access Denied**
   - Verify your AWS credentials in Vercel environment variables
   - Check that your IAM user has the correct S3 permissions

3. **CORS Errors**
   - Make sure your frontend URL is allowed in the CORS configuration

### Need Help?

If you encounter any issues, check the Vercel deployment logs for error messages.
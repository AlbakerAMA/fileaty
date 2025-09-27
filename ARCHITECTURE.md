# Fileaty - System Architecture

## High-Level Architecture

```mermaid
graph TD
    A[Client Browser] --> B[Express.js Server]
    B --> C[MySQL Database]
    B --> D[AWS S3]
    B --> E[Authentication System]
    
    subgraph Backend
        B
        C
        D
        E
    end
    
    subgraph Frontend
        A
    end
```

## Component Diagram

```mermaid
graph TD
    A[Frontend] --> B[API Layer]
    B --> C[Authentication Service]
    B --> D[File Management Service]
    B --> E[Comment Service]
    C --> F[User Model]
    D --> G[File Model]
    E --> H[Comment Model]
    F --> I[MySQL Database]
    G --> I
    H --> I
    D --> J[AWS S3]
    
    style A fill:#ffe4c4,stroke:#333
    style B fill:#e6e6fa,stroke:#333
    style C fill:#90ee90,stroke:#333
    style D fill:#90ee90,stroke:#333
    style E fill:#90ee90,stroke:#333
    style F fill:#87ceeb,stroke:#333
    style G fill:#87ceeb,stroke:#333
    style H fill:#87ceeb,stroke:#333
    style I fill:#ffa07a,stroke:#333
    style J fill:#ffa07a,stroke:#333
```

## Data Flow

### User Registration
1. User fills registration form on frontend
2. Frontend sends POST request to `/api/auth/signup`
3. Auth controller validates input
4. User model creates new user in database
5. JWT token is generated and returned to client

### File Upload
1. User selects file on dashboard
2. Frontend sends POST request with file to `/api/files/upload`
3. Auth middleware verifies JWT token
4. File controller uploads file to AWS S3
5. File metadata is saved to database
6. Success response is returned to client

### File Download
1. User clicks download button
2. Frontend sends GET request to `/api/files/:id/download`
3. Auth middleware verifies JWT token
4. File controller retrieves file metadata from database
5. Client is redirected to S3 URL for download

### Comment Management
1. User adds comment in file preview
2. Frontend sends POST request to `/api/comments/file/:fileId`
3. Auth middleware verifies JWT token
4. Comment controller saves comment to database
5. Comment is returned to client for display

## Security Considerations

- All API endpoints are protected with JWT authentication
- Role-based access control for admin operations
- Passwords are hashed using bcrypt
- AWS credentials are stored in environment variables
- CORS is configured to prevent unauthorized access
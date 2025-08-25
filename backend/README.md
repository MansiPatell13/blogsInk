# BlogsInk Backend

This is the backend API for the BlogsInk blogging platform. It provides a RESTful API for the frontend application to interact with.

## Features

- User authentication and authorization
- Blog creation, reading, updating, and deletion
- Comment system with replies
- Category and tag management
- File uploads with Cloudinary integration
- Search functionality with filters and suggestions
- User preferences and accessibility settings
- Notification system
- SEO optimization

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Cloudinary for cloud storage

## Project Structure

```
├── config/             # Configuration files
├── controllers/        # Route controllers
├── docs/               # API and schema documentation
├── middleware/         # Custom middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── uploads/            # Local file uploads (fallback)
├── utils/              # Utility functions
├── server.js           # Entry point
└── config.env          # Environment variables
```

## API Documentation

Detailed API documentation is available in the [API Documentation](./docs/api-documentation.md) file.

The MongoDB schema documentation is available in the [Schema Documentation](./docs/schema-documentation.md) file.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (optional)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/blogsInk.git
cd blogsInk/backend
```

2. Install dependencies

```bash
npm install
```

3. Create a `config.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_password
FROM_EMAIL=noreply@blogsink.com
FROM_NAME=BlogsInk
```

4. Start the server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

The API is organized into the following routes:

- `/api/auth` - Authentication routes
- `/api/blogs` - Blog management
- `/api/comments` - Comment system
- `/api/categories` - Category management
- `/api/tags` - Tag management
- `/api/uploads` - File uploads
- `/api/users` - User management
- `/api/search` - Search functionality
- `/api/notifications` - Notification system
- `/api/preferences` - User preferences
- `/api/seo` - SEO management

For detailed information on each endpoint, refer to the [API Documentation](./docs/api-documentation.md).

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

## File Uploads

The API supports file uploads for:

- Blog cover images
- User profile pictures
- Content images (for rich text editor)
- Category images

Files are uploaded to Cloudinary by default. If Cloudinary credentials are not provided, files will be stored locally.

## Error Handling

The API returns consistent error responses with appropriate HTTP status codes:

```json
{
  "success": false,
  "error": "Error message",
  "stack": "Error stack trace (only in development mode)"
}
```

## License

This project is licensed under the MIT License.
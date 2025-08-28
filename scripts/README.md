# BlogsInk Scripts

This directory contains utility scripts for the BlogsInk application.

## Database Setup Script

The `setupDatabase.js` script creates MongoDB collections with schema validation based on the JSON schema definitions.

### Prerequisites

- MongoDB server running
- Node.js installed

### Installation

```bash
npm install
```

### Usage

To set up the database with proper schema validation:

```bash
npm run setup-db
```

This script will:

1. Create the following collections with schema validation:
   - `users`
   - `blogs`
   - `comments`
   - `categories`

2. Create appropriate indexes for better query performance:
   - Unique index on `email` field in the `users` collection
   - Unique index on `slug` field in the `blogs` collection
   - Indexes on `blog` and `author` fields in the `comments` collection
   - Unique index on `slug` field in the `categories` collection

### Environment Variables

The script uses the following environment variables:

- `MONGODB_URI`: MongoDB connection string (defaults to `mongodb://localhost:27017/blogsInk` if not provided)

### Troubleshooting

If you encounter any issues:

1. Make sure MongoDB is running
2. Check that the connection string is correct
3. Ensure you have proper permissions to create collections and indexes
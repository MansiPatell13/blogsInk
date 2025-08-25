# BlogsInk API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

### Register User

```
POST /auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "avatar-url",
    "role": "user"
  }
}
```

### Login User

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "jwt-token-here",
  "user": {
    "_id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "avatar-url",
    "role": "user"
  }
}
```

### Get Current User

```
GET /auth/me
```

**Headers:**

```
Authorization: Bearer jwt-token-here
```

**Response:**

```json
{
  "_id": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "avatar-url",
  "role": "user"
}
```

## Blogs

### Get All Blogs

```
GET /blogs
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field (default: createdAt)
- `order`: Sort order (asc/desc, default: desc)
- `search`: Search term
- `category`: Filter by category ID
- `tag`: Filter by tag ID
- `author`: Filter by author ID

**Response:**

```json
{
  "blogs": [
    {
      "_id": "blog-id",
      "title": "Blog Title",
      "excerpt": "Blog excerpt...",
      "content": "Blog content...",
      "author": {
        "_id": "user-id",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "category": {
        "_id": "category-id",
        "name": "Category Name",
        "slug": "category-slug"
      },
      "tags": [
        {
          "_id": "tag-id",
          "name": "tag-name",
          "displayName": "Tag Name"
        }
      ],
      "coverImage": "image-url",
      "slug": "blog-slug",
      "status": "published",
      "views": 42,
      "likes": ["user-id-1", "user-id-2"],
      "publishedAt": "2023-01-01T00:00:00.000Z",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### Get Single Blog

```
GET /blogs/:id
```

**Response:**

```json
{
  "_id": "blog-id",
  "title": "Blog Title",
  "excerpt": "Blog excerpt...",
  "content": "Blog content...",
  "author": {
    "_id": "user-id",
    "name": "John Doe",
    "avatar": "avatar-url",
    "bio": "Author bio"
  },
  "category": {
    "_id": "category-id",
    "name": "Category Name",
    "slug": "category-slug"
  },
  "tags": [
    {
      "_id": "tag-id",
      "name": "tag-name",
      "displayName": "Tag Name"
    }
  ],
  "coverImage": "image-url",
  "slug": "blog-slug",
  "status": "published",
  "views": 42,
  "likes": ["user-id-1", "user-id-2"],
  "comments": [
    {
      "_id": "comment-id",
      "content": "Comment content",
      "author": {
        "_id": "user-id",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "publishedAt": "2023-01-01T00:00:00.000Z",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Create Blog

```
POST /blogs
```

**Headers:**

```
Authorization: Bearer jwt-token-here
```

**Request Body:**

```json
{
  "title": "Blog Title",
  "content": "Blog content...",
  "excerpt": "Blog excerpt...",
  "category": "category-id",
  "tags": ["tag-id-1", "tag-id-2"],
  "coverImage": "image-url",
  "status": "draft" // or "published"
}
```

**Response:**

```json
{
  "_id": "blog-id",
  "title": "Blog Title",
  "excerpt": "Blog excerpt...",
  "content": "Blog content...",
  "author": "user-id",
  "category": "category-id",
  "tags": ["tag-id-1", "tag-id-2"],
  "coverImage": "image-url",
  "slug": "blog-slug",
  "status": "draft",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Like/Unlike Blog

```
POST /blogs/:id/like
```

**Headers:**

```
Authorization: Bearer jwt-token-here
```

**Response:**

```json
{
  "message": "Blog liked", // or "Blog unliked"
  "likes": 42
}
```

## Comments

### Get Comments for Blog

```
GET /comments/blogs/:blogId/comments
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**

```json
{
  "comments": [
    {
      "_id": "comment-id",
      "content": "Comment content",
      "author": {
        "_id": "user-id",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "blog": "blog-id",
      "parentComment": null,
      "replies": [
        {
          "_id": "reply-id",
          "content": "Reply content",
          "author": {
            "_id": "user-id",
            "name": "Jane Doe",
            "avatar": "avatar-url"
          },
          "createdAt": "2023-01-01T00:00:00.000Z"
        }
      ],
      "likes": ["user-id-1", "user-id-2"],
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "total": 42
}
```

### Create Comment

```
POST /comments/blogs/:blogId/comments
```

**Headers:**

```
Authorization: Bearer jwt-token-here
```

**Request Body:**

```json
{
  "content": "Comment content",
  "parentComment": "parent-comment-id" // Optional, for replies
}
```

**Response:**

```json
{
  "_id": "comment-id",
  "content": "Comment content",
  "author": {
    "_id": "user-id",
    "name": "John Doe",
    "avatar": "avatar-url"
  },
  "blog": "blog-id",
  "parentComment": "parent-comment-id", // or null
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

## Categories

### Get All Categories

```
GET /categories
```

**Query Parameters:**

- `featured`: Filter by featured status (true/false)
- `withBlogCount`: Include blog count (true/false)

**Response:**

```json
[
  {
    "_id": "category-id",
    "name": "Category Name",
    "slug": "category-slug",
    "description": "Category description",
    "image": "image-url",
    "color": "#FFFFFF",
    "featured": true,
    "blogCount": 42, // Only if withBlogCount=true
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Get Single Category

```
GET /categories/:slug
```

**Response:**

```json
{
  "_id": "category-id",
  "name": "Category Name",
  "slug": "category-slug",
  "description": "Category description",
  "image": "image-url",
  "color": "#FFFFFF",
  "featured": true,
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

### Get Blogs by Category

```
GET /categories/:slug/blogs
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field (default: createdAt)
- `order`: Sort order (asc/desc, default: desc)

**Response:**

```json
{
  "blogs": [
    {
      "_id": "blog-id",
      "title": "Blog Title",
      "excerpt": "Blog excerpt...",
      "author": {
        "_id": "user-id",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "coverImage": "image-url",
      "slug": "blog-slug",
      "views": 42,
      "likes": ["user-id-1", "user-id-2"],
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  },
  "category": {
    "_id": "category-id",
    "name": "Category Name",
    "slug": "category-slug",
    "description": "Category description"
  }
}
```

## Tags

### Get All Tags

```
GET /tags
```

**Query Parameters:**

- `sort`: Sort field (name, count, featured)
- `featured`: Filter by featured status (true/false)

**Response:**

```json
[
  {
    "_id": "tag-id",
    "name": "tag-name",
    "displayName": "Tag Name",
    "description": "Tag description",
    "count": 42,
    "featured": true,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Get Blogs by Tag

```
GET /tags/:name/blogs
```

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field (default: createdAt)
- `order`: Sort order (asc/desc, default: desc)

**Response:**

```json
{
  "blogs": [
    {
      "_id": "blog-id",
      "title": "Blog Title",
      "excerpt": "Blog excerpt...",
      "author": {
        "_id": "user-id",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "category": {
        "_id": "category-id",
        "name": "Category Name",
        "slug": "category-slug"
      },
      "coverImage": "image-url",
      "slug": "blog-slug",
      "views": 42,
      "likes": ["user-id-1", "user-id-2"],
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  },
  "tag": {
    "_id": "tag-id",
    "name": "tag-name",
    "displayName": "Tag Name",
    "description": "Tag description"
  }
}
```

## Search

### Advanced Search

```
GET /search
```

**Query Parameters:**

- `q`: Search query
- `category`: Filter by category ID
- `tags`: Filter by tag IDs (comma-separated)
- `author`: Filter by author ID
- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: Sort order (asc/desc, default: desc)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Headers (optional):**

```
Authorization: Bearer jwt-token-here
```

**Response:**

```json
{
  "blogs": [
    {
      "_id": "blog-id",
      "title": "Blog Title",
      "excerpt": "Blog excerpt...",
      "author": {
        "_id": "user-id",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "category": {
        "_id": "category-id",
        "name": "Category Name",
        "slug": "category-slug"
      },
      "tags": [
        {
          "_id": "tag-id",
          "name": "tag-name",
          "displayName": "Tag Name"
        }
      ],
      "coverImage": "image-url",
      "slug": "blog-slug",
      "views": 42,
      "likes": ["user-id-1", "user-id-2"],
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### Search Suggestions

```
GET /search/suggestions
```

**Query Parameters:**

- `q`: Search query
- `limit`: Maximum number of suggestions per type (default: 5)

**Response:**

```json
{
  "blogs": [
    {
      "_id": "blog-id",
      "title": "Blog Title",
      "slug": "blog-slug"
    }
  ],
  "tags": [
    {
      "_id": "tag-id",
      "name": "tag-name",
      "displayName": "Tag Name"
    }
  ],
  "categories": [
    {
      "_id": "category-id",
      "name": "Category Name",
      "slug": "category-slug"
    }
  ],
  "authors": [
    {
      "_id": "user-id",
      "name": "John Doe",
      "avatar": "avatar-url"
    }
  ]
}
```

## Notifications

### Get User Notifications

```
GET /notifications
```

**Headers:**

```
Authorization: Bearer jwt-token-here
```

**Query Parameters:**

- `read`: Filter by read status (true/false)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**

```json
{
  "notifications": [
    {
      "_id": "notification-id",
      "type": "comment", // comment, like, follow, mention, system, blog_published
      "message": "John Doe commented on your blog post",
      "read": false,
      "sender": {
        "_id": "user-id",
        "name": "John Doe",
        "avatar": "avatar-url"
      },
      "relatedBlog": {
        "_id": "blog-id",
        "title": "Blog Title",
        "slug": "blog-slug"
      },
      "link": "/blog/blog-slug#comment-123",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "pages": 3
  },
  "unreadCount": 5
}
```

### Mark Notification as Read

```
PATCH /notifications/:id/read
```

**Headers:**

```
Authorization: Bearer jwt-token-here
```

**Response:**

```json
{
  "message": "Notification marked as read",
  "notification": {
    "_id": "notification-id",
    "read": true
  }
}
```

### Mark All Notifications as Read

```
PATCH /notifications/read-all
```

**Headers:**

```
Authorization: Bearer jwt-token-here
```

**Response:**

```json
{
  "message": "All notifications marked as read",
  "count": 5
}
```

## User Preferences

### Get User Preferences

```
GET /preferences
```

**Headers:**

```
Authorization: Bearer jwt-token-here
```

**Response:**

```json
{
  "_id": "preference-id",
  "user": "user-id",
  "theme": "light", // light, dark, system
  "fontSize": "medium", // small, medium, large
  "reducedMotion": false,
  "highContrast": false,
  "emailNotifications": {
    "comments": true,
    "likes": true,
    "follows": true,
    "newsletter": true
  },
  "pushNotifications": {
    "comments": true,
    "likes": true,
    "follows": true
  },
  "preferredCategories": [
    {
      "_id": "category-id",
      "name": "Category Name",
      "slug": "category-slug"
    }
  ],
  "preferredTags": [
    {
      "_id": "tag-id",
      "name": "tag-name",
      "displayName": "Tag Name"
    }
  ],
  "language": "en",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Update User Preferences

```
PATCH /preferences
```

**Headers:**

```
Authorization: Bearer jwt-token-here
```

**Request Body:**

```json
{
  "theme": "dark",
  "fontSize": "large",
  "reducedMotion": true,
  "highContrast": false,
  "emailNotifications": {
    "comments": true,
    "likes": false,
    "follows": true,
    "newsletter": true
  },
  "pushNotifications": {
    "comments": true,
    "likes": false,
    "follows": true
  },
  "preferredCategories": ["category-id-1", "category-id-2"],
  "preferredTags": ["tag-id-1", "tag-id-2"],
  "language": "fr"
}
```

**Response:**

```json
{
  "message": "Preferences updated successfully",
  "preferences": {
    "_id": "preference-id",
    "user": "user-id",
    "theme": "dark",
    "fontSize": "large",
    "reducedMotion": true,
    "highContrast": false,
    "emailNotifications": {
      "comments": true,
      "likes": false,
      "follows": true,
      "newsletter": true
    },
    "pushNotifications": {
      "comments": true,
      "likes": false,
      "follows": true
    },
    "preferredCategories": ["category-id-1", "category-id-2"],
    "preferredTags": ["tag-id-1", "tag-id-2"],
    "language": "fr",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## File Uploads

### Upload Blog Image

```
POST /uploads/blog-image
```

**Headers:**

```
Authorization: Bearer jwt-token-here
Content-Type: multipart/form-data
```

**Form Data:**

```
image: [file]
```

**Response:**

```json
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/...",
  "publicId": "blogsInk/blog-covers/image123"
}
```

### Upload Profile Image

```
POST /uploads/profile-image
```

**Headers:**

```
Authorization: Bearer jwt-token-here
Content-Type: multipart/form-data
```

**Form Data:**

```
avatar: [file]
```

**Response:**

```json
{
  "success": true,
  "avatarUrl": "https://res.cloudinary.com/...",
  "publicId": "blogsInk/avatars/image123"
}
```

### Upload Content Image

```
POST /uploads/content-image
```

**Headers:**

```
Authorization: Bearer jwt-token-here
Content-Type: multipart/form-data
```

**Form Data:**

```
image: [file]
```

**Response:**

```json
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/...",
  "publicId": "blogsInk/content/image123"
}
```

### Upload Category Image

```
POST /uploads/category-image
```

**Headers:**

```
Authorization: Bearer jwt-token-here
Content-Type: multipart/form-data
```

**Form Data:**

```
image: [file]
```

**Response:**

```json
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/...",
  "publicId": "blogsInk/categories/image123"
}
```

### Delete Image

```
DELETE /uploads/:publicId
```

**Headers:**

```
Authorization: Bearer jwt-token-here
```

**Response:**

```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

## SEO

### Get SEO Data for Blog

```
GET /seo/blog/:blogId
```

**Response:**

```json
{
  "_id": "seo-id",
  "blog": "blog-id",
  "title": "SEO optimized title",
  "description": "SEO meta description",
  "keywords": ["keyword1", "keyword2"],
  "canonicalUrl": "https://example.com/blog/blog-slug",
  "ogTitle": "Open Graph title",
  "ogDescription": "Open Graph description",
  "ogImage": "https://res.cloudinary.com/...",
  "twitterTitle": "Twitter title",
  "twitterDescription": "Twitter description",
  "twitterImage": "https://res.cloudinary.com/...",
  "structuredData": {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Blog Title",
    "datePublished": "2023-01-01T00:00:00.000Z"
  },
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Create/Update SEO Data for Blog

```
POST /seo/blog/:blogId
```

**Headers:**

```
Authorization: Bearer jwt-token-here
```

**Request Body:**

```json
{
  "title": "SEO optimized title",
  "description": "SEO meta description",
  "keywords": ["keyword1", "keyword2"],
  "canonicalUrl": "https://example.com/blog/blog-slug",
  "ogTitle": "Open Graph title",
  "ogDescription": "Open Graph description",
  "ogImage": "https://res.cloudinary.com/...",
  "twitterTitle": "Twitter title",
  "twitterDescription": "Twitter description",
  "twitterImage": "https://res.cloudinary.com/..."
}
```

**Response:**

```json
{
  "message": "SEO data updated successfully",
  "seoData": {
    "_id": "seo-id",
    "blog": "blog-id",
    "title": "SEO optimized title",
    "description": "SEO meta description",
    "keywords": ["keyword1", "keyword2"],
    "canonicalUrl": "https://example.com/blog/blog-slug",
    "ogTitle": "Open Graph title",
    "ogDescription": "Open Graph description",
    "ogImage": "https://res.cloudinary.com/...",
    "twitterTitle": "Twitter title",
    "twitterDescription": "Twitter description",
    "twitterImage": "https://res.cloudinary.com/...",
    "structuredData": {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "Blog Title",
      "datePublished": "2023-01-01T00:00:00.000Z"
    },
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```
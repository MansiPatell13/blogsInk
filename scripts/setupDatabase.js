const { MongoClient } = require('mongodb');
const config = require('../backend/config');

async function setupDatabase() {
  let client;

  try {
    // Connect to MongoDB
    client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogsInk');
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();

    // Create users collection with schema validation
    await db.createCollection('users', { 
      validator: { 
        $jsonSchema: { 
          bsonType: 'object', 
          required: ['name', 'email', 'password'], 
          properties: { 
            name: { 
              bsonType: 'string', 
              description: 'must be a string and is required' 
            }, 
            email: { 
              bsonType: 'string', 
              description: 'must be a string and is required' 
            }, 
            password: { 
              bsonType: 'string', 
              description: 'must be a string and is required' 
            }, 
            role: { 
              bsonType: 'string', 
              enum: ['user', 'admin', 'editor'], 
              description: 'must be one of the enum values' 
            }, 
            avatar: { 
              bsonType: 'string', 
              description: 'must be a string' 
            }, 
            avatarPublicId: { 
              bsonType: 'string', 
              description: 'must be a string' 
            }, 
            bio: { 
              bsonType: 'string', 
              description: 'must be a string' 
            }, 
            isVerified: { 
              bsonType: 'bool', 
              description: 'must be a boolean' 
            }, 
            socialLinks: { 
              bsonType: 'object', 
              properties: { 
                twitter: { bsonType: 'string' }, 
                facebook: { bsonType: 'string' }, 
                instagram: { bsonType: 'string' }, 
                linkedin: { bsonType: 'string' }, 
                github: { bsonType: 'string' } 
              } 
            }, 
            notificationSettings: { 
              bsonType: 'object', 
              properties: { 
                email: { bsonType: 'bool' }, 
                push: { bsonType: 'bool' }, 
                marketing: { bsonType: 'bool' } 
              } 
            }, 
            createdAt: { bsonType: 'date' }, 
            updatedAt: { bsonType: 'date' } 
          } 
        } 
      } 
    });
    console.log('Users collection created with schema validation');

    // Create unique index on email
    await db.collection('users').createIndex({ 'email': 1 }, { unique: true });
    console.log('Created unique index on email field in users collection');

    // Create blogs collection with schema validation
    await db.createCollection('blogs', { 
      validator: { 
        $jsonSchema: { 
          bsonType: 'object', 
          required: ['title', 'slug', 'content', 'author'], 
          properties: { 
            title: { 
              bsonType: 'string', 
              description: 'must be a string and is required' 
            }, 
            slug: { 
              bsonType: 'string', 
              description: 'must be a string and is required' 
            }, 
            content: { 
              bsonType: 'string', 
              description: 'must be a string and is required' 
            }, 
            excerpt: { 
              bsonType: 'string', 
              description: 'must be a string' 
            }, 
            author: { 
              bsonType: 'objectId', 
              description: 'must be an objectId and is required' 
            }, 
            category: { 
              bsonType: 'objectId', 
              description: 'must be an objectId' 
            }, 
            tags: { 
              bsonType: 'array', 
              items: { 
                bsonType: 'objectId' 
              } 
            }, 
            imageUrl: { 
              bsonType: 'string', 
              description: 'must be a string' 
            }, 
            imagePublicId: { 
              bsonType: 'string', 
              description: 'must be a string' 
            }, 
            imageAlt: { 
              bsonType: 'string', 
              description: 'must be a string' 
            }, 
            status: { 
              bsonType: 'string', 
              enum: ['draft', 'published', 'archived'], 
              description: 'must be one of the enum values' 
            }, 
            likes: { 
              bsonType: 'array', 
              items: { 
                bsonType: 'objectId' 
              } 
            }, 
            views: { 
              bsonType: 'int', 
              description: 'must be an integer' 
            }, 
            readTime: { 
              bsonType: 'int', 
              description: 'must be an integer' 
            }, 
            comments: { 
              bsonType: 'array', 
              items: { 
                bsonType: 'objectId' 
              } 
            }, 
            seo: { 
              bsonType: 'objectId', 
              description: 'must be an objectId' 
            }, 
            accessibility: { 
              bsonType: 'object', 
              properties: { 
                hasAltText: { bsonType: 'bool' }, 
                hasStructuredContent: { bsonType: 'bool' }, 
                readabilityScore: { bsonType: 'int' } 
              } 
            }, 
            featured: { 
              bsonType: 'bool', 
              description: 'must be a boolean' 
            }, 
            createdAt: { bsonType: 'date' }, 
            updatedAt: { bsonType: 'date' } 
          } 
        } 
      } 
    });
    console.log('Blogs collection created with schema validation');

    // Create unique index on slug
    await db.collection('blogs').createIndex({ 'slug': 1 }, { unique: true });
    console.log('Created unique index on slug field in blogs collection');

    // Create comments collection with schema validation
    await db.createCollection('comments', { 
      validator: { 
        $jsonSchema: { 
          bsonType: 'object', 
          required: ['content', 'author', 'blog'], 
          properties: { 
            content: { 
              bsonType: 'string', 
              description: 'must be a string and is required' 
            }, 
            author: { 
              bsonType: 'objectId', 
              description: 'must be an objectId and is required' 
            }, 
            blog: { 
              bsonType: 'objectId', 
              description: 'must be an objectId and is required' 
            }, 
            parent: { 
              bsonType: 'objectId', 
              description: 'must be an objectId' 
            }, 
            replies: { 
              bsonType: 'array', 
              items: { 
                bsonType: 'objectId' 
              } 
            }, 
            likes: { 
              bsonType: 'array', 
              items: { 
                bsonType: 'objectId' 
              } 
            }, 
            isEdited: { 
              bsonType: 'bool', 
              description: 'must be a boolean' 
            }, 
            createdAt: { bsonType: 'date' }, 
            updatedAt: { bsonType: 'date' } 
          } 
        } 
      } 
    });
    console.log('Comments collection created with schema validation');

    // Create indexes for faster queries
    await db.collection('comments').createIndex({ 'blog': 1 });
    await db.collection('comments').createIndex({ 'author': 1 });
    console.log('Created indexes on blog and author fields in comments collection');

    // Create categories collection with schema validation
    await db.createCollection('categories', { 
      validator: { 
        $jsonSchema: { 
          bsonType: 'object', 
          required: ['name', 'slug'], 
          properties: { 
            name: { 
              bsonType: 'string', 
              description: 'must be a string and is required' 
            }, 
            slug: { 
              bsonType: 'string', 
              description: 'must be a string and is required' 
            }, 
            description: { 
              bsonType: 'string', 
              description: 'must be a string' 
            }, 
            imageUrl: { 
              bsonType: 'string', 
              description: 'must be a string' 
            }, 
            imagePublicId: { 
              bsonType: 'string', 
              description: 'must be a string' 
            }, 
            color: { 
              bsonType: 'string', 
              description: 'must be a string' 
            }, 
            featured: { 
              bsonType: 'bool', 
              description: 'must be a boolean' 
            }, 
            parent: { 
              bsonType: 'objectId', 
              description: 'must be an objectId' 
            }, 
            blogCount: { 
              bsonType: 'int', 
              description: 'must be an integer' 
            }, 
            createdAt: { bsonType: 'date' }, 
            updatedAt: { bsonType: 'date' } 
          } 
        } 
      } 
    });
    console.log('Categories collection created with schema validation');

    // Create unique index on slug
    await db.collection('categories').createIndex({ 'slug': 1 }, { unique: true });
    console.log('Created unique index on slug field in categories collection');

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the setup function
setupDatabase();
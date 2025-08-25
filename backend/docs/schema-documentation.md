# BlogsInk MongoDB Schema Documentation

## User Schema

```javascript
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  avatarPublicId: {
    type: String
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

## Blog Schema

```javascript
const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  excerpt: {
    type: String,
    required: [true, 'Please add an excerpt'],
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  coverImage: {
    type: String,
    default: 'default-blog-cover.jpg'
  },
  coverImagePublicId: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  publishedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```

## Comment Schema

```javascript
const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

## Category Schema

```javascript
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  image: {
    type: String
  },
  imagePublicId: {
    type: String
  },
  color: {
    type: String,
    default: '#3B82F6' // Default blue color
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

## Tag Schema

```javascript
const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [30, 'Name cannot be more than 30 characters']
  },
  displayName: {
    type: String,
    required: [true, 'Please add a display name'],
    trim: true,
    maxlength: [30, 'Display name cannot be more than 30 characters']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

## Notification Schema

```javascript
const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['comment', 'like', 'follow', 'mention', 'system', 'blog_published'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  relatedBlog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  },
  relatedComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  link: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

## UserPreference Schema

```javascript
const UserPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  fontSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  },
  reducedMotion: {
    type: Boolean,
    default: false
  },
  highContrast: {
    type: Boolean,
    default: false
  },
  emailNotifications: {
    comments: {
      type: Boolean,
      default: true
    },
    likes: {
      type: Boolean,
      default: true
    },
    follows: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: true
    }
  },
  pushNotifications: {
    comments: {
      type: Boolean,
      default: true
    },
    likes: {
      type: Boolean,
      default: true
    },
    follows: {
      type: Boolean,
      default: true
    }
  },
  preferredCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  preferredTags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  language: {
    type: String,
    default: 'en'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```

## SearchHistory Schema

```javascript
const SearchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  query: {
    type: String,
    required: true
  },
  filters: {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dateRange: {
      startDate: Date,
      endDate: Date
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

## SEO Schema

```javascript
const SEOSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    maxlength: [70, 'SEO title cannot be more than 70 characters']
  },
  description: {
    type: String,
    required: true,
    maxlength: [160, 'SEO description cannot be more than 160 characters']
  },
  keywords: [{
    type: String
  }],
  canonicalUrl: {
    type: String
  },
  ogTitle: {
    type: String,
    maxlength: [70, 'Open Graph title cannot be more than 70 characters']
  },
  ogDescription: {
    type: String,
    maxlength: [200, 'Open Graph description cannot be more than 200 characters']
  },
  ogImage: {
    type: String
  },
  twitterTitle: {
    type: String,
    maxlength: [70, 'Twitter title cannot be more than 70 characters']
  },
  twitterDescription: {
    type: String,
    maxlength: [200, 'Twitter description cannot be more than 200 characters']
  },
  twitterImage: {
    type: String
  },
  structuredData: {
    type: Object
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```
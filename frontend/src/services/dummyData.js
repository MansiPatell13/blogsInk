// Dummy data service for BlogsInk frontend
export const dummyUsers = [
  {
    _id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: '/placeholder-user.jpg',
    bio: 'Tech enthusiast and blogger',
    followers: 1250,
    following: 340
  },
  {
    _id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: '/placeholder-user.jpg',
    bio: 'Travel writer and photographer',
    followers: 890,
    following: 120
  },
  {
    _id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    avatar: '/placeholder-user.jpg',
    bio: 'Food blogger and chef',
    followers: 2100,
    following: 450
  }
]

export const dummyCategories = [
  {
    _id: 'cat1',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest in tech and innovation',
    color: '#3B82F6',
    blogCount: 15
  },
  {
    _id: 'cat2',
    name: 'Travel',
    slug: 'travel',
    description: 'Explore the world through stories',
    color: '#10B981',
    blogCount: 12
  },
  {
    _id: 'cat3',
    name: 'Food',
    slug: 'food',
    description: 'Culinary adventures and recipes',
    color: '#F59E0B',
    blogCount: 8
  },
  {
    _id: 'cat4',
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Life tips and personal stories',
    color: '#EF4444',
    blogCount: 10
  },
  {
    _id: 'cat5',
    name: 'Health',
    slug: 'health',
    description: 'Wellness and health tips',
    color: '#8B5CF6',
    blogCount: 6
  }
]

export const dummyTags = [
  { _id: 'tag1', name: 'javascript', displayName: 'JavaScript' },
  { _id: 'tag2', name: 'react', displayName: 'React' },
  { _id: 'tag3', name: 'travel-tips', displayName: 'Travel Tips' },
  { _id: 'tag4', name: 'cooking', displayName: 'Cooking' },
  { _id: 'tag5', name: 'wellness', displayName: 'Wellness' },
  { _id: 'tag6', name: 'productivity', displayName: 'Productivity' }
]

export const dummyBlogs = [
  {
    _id: 'blog1',
    title: 'Getting Started with React Hooks',
    slug: 'getting-started-react-hooks',
    excerpt: 'Learn how to use React Hooks to build modern, functional components with state management.',
    content: `# Getting Started with React Hooks

React Hooks revolutionized the way we write React components. In this comprehensive guide, we'll explore the most commonly used hooks and how they can make your code more readable and maintainable.

## What are React Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 and have become the standard way to write React components.

## useState Hook

The useState hook allows you to add state to functional components:

\`\`\`javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## useEffect Hook

The useEffect hook lets you perform side effects in function components:

\`\`\`javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Best Practices

1. Always use hooks at the top level of your React function
2. Don't call hooks inside loops, conditions, or nested functions
3. Use custom hooks to share stateful logic between components
4. Keep your effects focused and specific

React Hooks provide a more direct API to the React concepts you already know. Happy coding!`,
    author: dummyUsers[0],
    category: dummyCategories[0],
    tags: [dummyTags[0], dummyTags[1]],
    imageUrl: '/placeholder.jpg',
    status: 'published',
    publishedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    likes: ['user1', 'user2', 'user3'],
    views: 1250,
    readTime: 8,
    featured: true,
    seoTitle: 'React Hooks Guide - Learn useState and useEffect',
    seoDescription: 'Complete guide to React Hooks with practical examples'
  },
  {
    _id: 'blog2',
    title: 'Hidden Gems of Southeast Asia',
    slug: 'hidden-gems-southeast-asia',
    excerpt: 'Discover breathtaking destinations off the beaten path in Southeast Asia that most tourists never see.',
    content: `# Hidden Gems of Southeast Asia

Southeast Asia is full of incredible destinations that remain largely undiscovered by mainstream tourism. Here are some hidden gems that will take your breath away.

## 1. Koh Rong Sanloem, Cambodia

This pristine island offers crystal-clear waters and untouched beaches. Perfect for those seeking tranquility away from crowded tourist spots.

## 2. Nusa Penida, Indonesia

A rugged island near Bali with dramatic cliffs, hidden beaches, and incredible snorkeling opportunities.

## 3. Kep, Cambodia

A charming coastal town famous for its fresh crab market and French colonial architecture.

## 4. Kampot, Cambodia

Known for its pepper plantations and laid-back riverside atmosphere.

## 5. Flores, Indonesia

Gateway to Komodo National Park with stunning landscapes and traditional villages.

## Travel Tips

- Visit during shoulder season for better weather and fewer crowds
- Learn basic local phrases
- Respect local customs and traditions
- Pack light and bring reef-safe sunscreen
- Always have travel insurance

These destinations offer authentic experiences and natural beauty that will create memories to last a lifetime.`,
    author: dummyUsers[1],
    category: dummyCategories[1],
    tags: [dummyTags[2]],
    imageUrl: '/placeholder.jpg',
    status: 'published',
    publishedAt: new Date('2024-01-12'),
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    likes: ['user1', 'user4', 'user5'],
    views: 890,
    readTime: 6,
    featured: false,
    seoTitle: 'Hidden Gems Southeast Asia - Off the Beaten Path',
    seoDescription: 'Discover amazing hidden destinations in Southeast Asia'
  },
  {
    _id: 'blog3',
    title: 'The Art of Homemade Pasta',
    slug: 'art-homemade-pasta',
    excerpt: 'Master the traditional techniques of making fresh pasta from scratch with simple ingredients.',
    content: `# The Art of Homemade Pasta

There's nothing quite like the satisfaction of making fresh pasta from scratch. With just a few simple ingredients and some practice, you can create restaurant-quality pasta at home.

## Ingredients You'll Need

- 400g tipo 00 flour (or all-purpose flour)
- 4 large eggs
- 1 tablespoon olive oil
- 1 teaspoon salt

## The Process

### 1. Make the Dough
Create a well with the flour on a clean surface. Crack eggs into the center, add oil and salt. Gradually incorporate flour using a fork.

### 2. Knead
Knead the dough for 8-10 minutes until smooth and elastic. The dough should spring back when pressed.

### 3. Rest
Wrap in plastic wrap and let rest for 30 minutes at room temperature.

### 4. Roll and Shape
Roll the dough thin using a pasta machine or rolling pin. Cut into your desired shape.

## Popular Pasta Shapes

- **Fettuccine**: Wide, flat ribbons perfect for cream sauces
- **Tagliatelle**: Similar to fettuccine but slightly wider
- **Pappardelle**: Very wide ribbons, great with meat sauces
- **Ravioli**: Stuffed pasta parcels

## Pro Tips

- Use semolina flour for dusting to prevent sticking
- Don't overwork the dough
- Keep unused portions covered to prevent drying
- Fresh pasta cooks much faster than dried (2-3 minutes)

## Sauce Pairings

- Light olive oil and herb sauces for delicate pasta
- Rich cream or meat sauces for heartier shapes
- Simple tomato sauce lets the pasta shine

Making pasta is a meditative process that connects you to centuries of culinary tradition. Enjoy the journey!`,
    author: dummyUsers[2],
    category: dummyCategories[2],
    tags: [dummyTags[3]],
    imageUrl: '/placeholder.jpg',
    status: 'published',
    publishedAt: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    likes: ['user2', 'user3'],
    views: 650,
    readTime: 5,
    featured: true,
    seoTitle: 'Homemade Pasta Recipe - Fresh Pasta from Scratch',
    seoDescription: 'Learn to make authentic homemade pasta with this step-by-step guide'
  },
  {
    _id: 'blog4',
    title: 'Mindful Morning Routines for Better Productivity',
    slug: 'mindful-morning-routines-productivity',
    excerpt: 'Transform your mornings with these science-backed habits that boost focus and energy throughout the day.',
    content: `# Mindful Morning Routines for Better Productivity

How you start your morning sets the tone for your entire day. A mindful morning routine can dramatically improve your focus, energy, and overall well-being.

## The Science Behind Morning Routines

Research shows that our willpower and decision-making abilities are strongest in the morning. By establishing positive habits early, we can leverage this mental clarity for maximum productivity.

## Essential Elements of a Mindful Morning

### 1. Wake Up Without Immediately Checking Your Phone
Give your brain time to naturally wake up before bombarding it with information and stimulation.

### 2. Hydration First
Start with a large glass of water to rehydrate your body after hours of sleep.

### 3. Movement
Even 5-10 minutes of stretching or light exercise can energize your body and mind.

### 4. Mindfulness Practice
- Meditation (5-20 minutes)
- Gratitude journaling
- Deep breathing exercises
- Mindful coffee/tea drinking

### 5. Intention Setting
Take a few minutes to review your priorities and set intentions for the day.

## Sample 30-Minute Morning Routine

- **0-5 min**: Wake up, make bed, drink water
- **5-15 min**: Light stretching or yoga
- **15-25 min**: Meditation or journaling
- **25-30 min**: Review daily priorities

## Benefits You'll Notice

- Increased focus and mental clarity
- Better emotional regulation
- Reduced stress and anxiety
- More consistent energy levels
- Improved sleep quality

## Getting Started

Start small! Pick just one or two elements and practice them consistently for a week before adding more. The key is consistency, not perfection.

Remember, the best morning routine is one that works for your lifestyle and preferences. Experiment and find what energizes and centers you.`,
    author: dummyUsers[0],
    category: dummyCategories[3],
    tags: [dummyTags[4], dummyTags[5]],
    imageUrl: '/placeholder.jpg',
    status: 'published',
    publishedAt: new Date('2024-01-08'),
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    likes: ['user1', 'user3', 'user4', 'user5'],
    views: 1100,
    readTime: 7,
    featured: false,
    seoTitle: 'Mindful Morning Routine for Productivity - Start Your Day Right',
    seoDescription: 'Science-backed morning habits to boost productivity and well-being'
  },
  {
    _id: 'blog5',
    title: 'Building Healthy Habits That Actually Stick',
    slug: 'building-healthy-habits-stick',
    excerpt: 'Learn the psychology behind habit formation and practical strategies to make positive changes last.',
    content: `# Building Healthy Habits That Actually Stick

We all want to build better habits, but why do so many of our attempts fail? Understanding the psychology of habit formation is key to creating lasting change.

## The Habit Loop

Every habit consists of three parts:
1. **Cue**: The trigger that initiates the behavior
2. **Routine**: The behavior itself
3. **Reward**: The benefit you get from the behavior

## Why Habits Fail

- Starting too big
- Lack of clear triggers
- No immediate rewards
- Trying to change too many things at once
- All-or-nothing thinking

## The 1% Better Principle

Focus on getting 1% better each day rather than dramatic changes. Small improvements compound over time into remarkable results.

## Practical Strategies

### 1. Start Ridiculously Small
- Want to exercise? Start with 1 push-up
- Want to read more? Start with 1 page
- Want to meditate? Start with 1 minute

### 2. Stack Your Habits
Attach new habits to existing ones:
"After I pour my morning coffee, I will write in my gratitude journal."

### 3. Design Your Environment
- Make good habits obvious and easy
- Make bad habits invisible and difficult

### 4. Track Your Progress
Use a simple habit tracker or calendar to mark your wins.

### 5. Celebrate Small Wins
Acknowledge every success, no matter how small.

## Common Healthy Habits to Start With

- Drinking more water
- Taking daily walks
- Eating one piece of fruit daily
- Doing 5 minutes of stretching
- Reading before bed instead of scrolling

## The 21-Day Myth

Contrary to popular belief, it takes an average of 66 days to form a new habit, not 21. Be patient with yourself.

## When You Slip Up

- Don't break the chain twice in a row
- Focus on getting back on track, not perfection
- Learn from what caused the slip

Remember: You don't have to be perfect, you just have to be consistent. Small changes, practiced daily, create extraordinary results over time.`,
    author: dummyUsers[2],
    category: dummyCategories[4],
    tags: [dummyTags[4], dummyTags[5]],
    imageUrl: '/placeholder.jpg',
    status: 'published',
    publishedAt: new Date('2024-01-05'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    likes: ['user2', 'user4'],
    views: 780,
    readTime: 6,
    featured: false,
    seoTitle: 'How to Build Healthy Habits That Stick - Psychology-Based Tips',
    seoDescription: 'Evidence-based strategies for building lasting healthy habits'
  }
]

export const dummyComments = [
  {
    _id: 'comment1',
    content: 'Great article! The useState examples really helped me understand the concept better.',
    author: dummyUsers[1],
    blog: 'blog1',
    createdAt: new Date('2024-01-16'),
    likes: ['user1', 'user3'],
    replies: []
  },
  {
    _id: 'comment2',
    content: 'I visited Koh Rong Sanloem last year and it was absolutely magical! Thanks for bringing back the memories.',
    author: dummyUsers[2],
    blog: 'blog2',
    createdAt: new Date('2024-01-13'),
    likes: ['user1'],
    replies: []
  },
  {
    _id: 'comment3',
    content: 'Tried this pasta recipe last weekend and it turned out amazing! My family loved it.',
    author: dummyUsers[0],
    blog: 'blog3',
    createdAt: new Date('2024-01-11'),
    likes: ['user2', 'user3'],
    replies: []
  }
]

// API simulation functions
export const dummyAPI = {
  // Blog endpoints
  getBlogs: (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredBlogs = [...dummyBlogs]
        
        if (params.category && params.category !== 'all') {
          filteredBlogs = filteredBlogs.filter(blog => blog.category._id === params.category)
        }
        
        if (params.search) {
          filteredBlogs = filteredBlogs.filter(blog => 
            blog.title.toLowerCase().includes(params.search.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(params.search.toLowerCase())
          )
        }
        
        resolve({
          data: {
            blogs: filteredBlogs,
            totalPages: Math.ceil(filteredBlogs.length / (params.limit || 10)),
            currentPage: params.page || 1,
            total: filteredBlogs.length
          }
        })
      }, 500)
    })
  },

  getBlog: (slug) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const blog = dummyBlogs.find(b => b.slug === slug)
        if (blog) {
          resolve({ data: blog })
        } else {
          reject(new Error('Blog not found'))
        }
      }, 300)
    })
  },

  // Category endpoints
  getCategories: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: dummyCategories })
      }, 200)
    })
  },

  // Tag endpoints
  getTags: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: dummyTags })
      }, 200)
    })
  },

  // Comment endpoints
  getComments: (blogId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const blogComments = dummyComments.filter(c => c.blog === blogId)
        resolve({
          data: {
            comments: blogComments,
            total: blogComments.length
          }
        })
      }, 300)
    })
  },

  // User endpoints
  getCurrentUser: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: dummyUsers[0] })
      }, 200)
    })
  },

  // Search endpoints
  searchBlogs: (query) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = dummyBlogs.filter(blog =>
          blog.title.toLowerCase().includes(query.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          blog.content.toLowerCase().includes(query.toLowerCase())
        )
        resolve({ data: { blogs: results } })
      }, 400)
    })
  }
}

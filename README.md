# BlogSink - MERN Stack Blogging Platform

A modern, full-featured blogging platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with user registration and login
- **Blog Management**: Create, edit, publish, and manage blog posts
- **Rich Text Editor**: Write beautiful blog posts with React Quill
- **User Profiles**: Customizable user profiles with avatars and bios
- **Search & Filtering**: Advanced search and category-based filtering
- **Like System**: Like and unlike blog posts
- **Admin Panel**: User management and platform administration
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live updates for likes, comments, and views

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form handling
- **React Quill** - Rich text editor
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
mern-blogsink/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Express server
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-blogsink
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   # or
   pnpm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   # or
   pnpm install
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `blogsink`
   - Update the connection string in `backend/config.js` if needed

5. **Environment Configuration**
   - Copy `backend/config.js` and modify as needed
   - Set your JWT secret and MongoDB URI

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   # Server will run on http://localhost:5000
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   # Frontend will run on http://localhost:3000
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Blogs
- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `POST /api/blogs/:id/like` - Like/unlike blog
- `GET /api/blogs/categories` - Get blog categories

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user profile
- `POST /api/users/:id/follow` - Follow/unfollow user
- `GET /api/users/:id/stats` - Get user statistics

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Register/Login**: Get a JWT token
2. **Protected Routes**: Include token in Authorization header
3. **Token Format**: `Bearer <your-jwt-token>`

## 🎨 Customization

### Styling
- Modify `frontend/src/index.css` for global styles
- Update Tailwind configuration in `frontend/tailwind.config.js`
- Customize component styles using Tailwind classes

### Features
- Add new routes in `frontend/src/App.jsx`
- Create new API endpoints in `backend/routes/`
- Extend MongoDB models in `backend/models/`

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy to your preferred platform
3. Update frontend API base URL

### Database
- Use MongoDB Atlas for cloud database
- Set up proper indexes for performance
- Configure backup and monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify MongoDB connection
3. Ensure all dependencies are installed
4. Check environment configuration

## 🔮 Future Enhancements

- **Real-time Chat**: WebSocket integration for comments
- **Image Upload**: Cloud storage integration
- **Email Notifications**: User engagement features
- **Analytics Dashboard**: Blog performance metrics
- **SEO Optimization**: Meta tags and sitemap generation
- **Mobile App**: React Native companion app

---

**Happy Blogging! 🚀**

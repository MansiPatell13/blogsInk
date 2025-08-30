// Mock API implementation using local JSON files

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API class
class MockApi {
  constructor() {
    this.baseURL = '';
    this.headers = {};
  }

  // Load JSON data from public folder
  async loadData(fileName) {
    try {
      const response = await fetch(`/data/${fileName}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${fileName} data`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading ${fileName} data:`, error);
      return [];
    }
  }

  // Generic GET method
  async get(endpoint) {
    await delay(300); // Simulate network delay
    
    // Parse the endpoint to determine which data to return
    if (endpoint === '/auth/me') {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return Promise.reject({ response: { status: 401 } });
      }
      
      const userId = JSON.parse(atob(token.split('.')[1])).userId;
      const users = await this.loadData('users');
      const user = users.find(u => u._id === userId);
      
      if (!user) {
        return Promise.reject({ response: { status: 401 } });
      }
      
      // Don't return password in response
      const { password, ...userWithoutPassword } = user;
      return { data: { user: userWithoutPassword } };
    }
    
    // Handle other GET endpoints
    if (endpoint.startsWith('/blogs')) {
      const blogs = await this.loadData('blogs');
      return { data: blogs };
    }
    
    // Default response
    return { data: {} };
  }

  // Generic POST method
  async post(endpoint, data) {
    await delay(500); // Simulate network delay
    
    // Handle authentication endpoints
    if (endpoint === '/auth/login') {
      const { email, password } = data;
      const users = await this.loadData('users');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return Promise.reject({
          response: { 
            status: 400,
            data: { message: 'Invalid credentials' }
          }
        });
      }
      
      // Create a mock JWT token
      const token = this.createMockToken(user);
      
      // Don't return password in response
      const { password: pwd, ...userWithoutPassword } = user;
      
      return {
        data: {
          message: 'Login successful',
          token,
          user: userWithoutPassword
        }
      };
    }
    
    if (endpoint === '/auth/register') {
      const { email, password, name } = data;
      const users = await this.loadData('users');
      
      // Check if user already exists
      if (users.some(u => u.email === email)) {
        return Promise.reject({
          response: { 
            status: 400,
            data: { message: 'User already exists' }
          }
        });
      }
      
      // Create new user (in a real app, we would save this)
      const newUser = {
        _id: `user${users.length + 1}`,
        name,
        email,
        password,
        avatar: '/placeholder-user.jpg',
        bio: '',
        role: 'user',
        createdAt: new Date().toISOString(),
        followers: 0,
        following: 0
      };
      
      // Create a mock JWT token
      const token = this.createMockToken(newUser);
      
      // Don't return password in response
      const { password: pwd, ...userWithoutPassword } = newUser;
      
      return {
        data: {
          message: 'Registration successful',
          token,
          user: userWithoutPassword
        }
      };
    }
    
    // Default response for unhandled endpoints
    return { data: {} };
  }

  // Helper to create a mock JWT token
  createMockToken(user) {
    // Create a simple mock token structure
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId: user._id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30) // 30 days
    }));
    const signature = btoa('mocksignature');
    
    return `${header}.${payload}.${signature}`;
  }
}

const api = new MockApi();

export default api

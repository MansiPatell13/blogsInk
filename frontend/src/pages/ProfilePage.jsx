import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  Edit, 
  Settings, 
  BookOpen, 
  Heart, 
  Eye, 
  MessageCircle, 
  Calendar,
  MapPin,
  Link as LinkIcon,
  MoreHorizontal,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '../utils/useAuth.jsx';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import BlogCard from '../components/BlogCard';
import EditProfileModal from '../components/profile/EditProfileModal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('blogs');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    if (username) {
      fetchProfile();
      fetchUserBlogs();
    } else if (currentUser) {
      // If no username provided, show current user's profile
      setProfile(currentUser);
      fetchUserBlogs();
    }
  }, [username, currentUser]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${username}`);
      setProfile(response.data);
    } catch (err) {
      setError('Profile not found');
      toast.error('Failed to load profile');
    }
  };

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      const userId = username || currentUser?.username;
      const response = await api.get(`/users/${userId}/blogs`);
      setBlogs(response.data);
    } catch (err) {
      toast.error('Failed to load user blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error('Please login to follow users');
      return;
    }

    try {
      const response = await api.post(`/users/${profile._id}/follow`);
      setProfile(response.data);
      toast.success(response.data.isFollowing ? 'Following!' : 'Unfollowed!');
    } catch (err) {
      toast.error('Failed to follow user');
    }
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
    setShowEditModal(false);
    toast.success('Profile updated successfully!');
  };

  const filteredAndSortedBlogs = blogs
    .filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || blog.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular':
          return (b.likes?.length || 0) - (a.likes?.length || 0);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

  const isOwnProfile = currentUser && profile && currentUser._id === profile._id;
  const isFollowing = profile?.followers?.includes(currentUser?._id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-8">The profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-start space-x-8">
            {/* Profile Avatar */}
            <div className="relative">
              <img
                src={profile.avatar || '/default-avatar.png'}
                alt={profile.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {isOwnProfile && (
                <button
                  onClick={handleEditProfile}
                  className="absolute bottom-0 right-0 bg-yellow-600 text-white p-2 rounded-full hover:bg-yellow-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                  <p className="text-gray-600 mb-2">@{profile.username}</p>
                  {profile.bio && (
                    <p className="text-gray-700 max-w-2xl">{profile.bio}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  {!isOwnProfile && currentUser && (
                    <Button
                      onClick={handleFollow}
                      variant={isFollowing ? 'outline' : 'default'}
                      className="min-w-[120px]"
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                  
                  {isOwnProfile && (
                    <Button
                      onClick={() => navigate('/settings')}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Profile Stats */}
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{blogs.length} posts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>{profile.followers?.length || 0} followers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{profile.following?.length || 0} following</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Additional Info */}
              {(profile.location || profile.website) && (
                <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
                  {profile.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-yellow-600 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>{profile.website}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('blogs')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'blogs'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Posts ({blogs.length})
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'liked'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Liked
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'saved'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Saved
            </button>
          </div>

          {isOwnProfile && (
            <Button
              onClick={() => navigate('/write')}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </Button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select
              value={sortBy}
              onValueChange={setSortBy}
              className="w-40"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="views">Most Views</option>
            </Select>
            
            <Select
              value={filterCategory}
              onValueChange={setFilterCategory}
              className="w-40"
            >
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="travel">Travel</option>
              <option value="food">Food</option>
              <option value="health">Health</option>
              <option value="business">Business</option>
              <option value="entertainment">Entertainment</option>
            </Select>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'blogs' && (
          <div>
            {filteredAndSortedBlogs.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-4">
                  {isOwnProfile 
                    ? "Start writing your first blog post!" 
                    : "This user hasn't published any posts yet."
                  }
                </p>
                {isOwnProfile && (
                  <Button onClick={() => navigate('/write')}>
                    Write Your First Post
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredAndSortedBlogs.map(blog => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Liked Posts</h3>
            <p className="text-gray-600">Posts you've liked will appear here.</p>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Saved Posts</h3>
            <p className="text-gray-600">Posts you've saved will appear here.</p>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default ProfilePage;

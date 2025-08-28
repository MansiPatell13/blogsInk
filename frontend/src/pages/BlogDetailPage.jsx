import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Eye, Share2, Bookmark, MoreHorizontal, Edit, Trash2, Flag } from 'lucide-react';
import { useAuth } from '../utils/useAuth.jsx';
import jsonDataService from '../services/jsonDataService';
import { toast } from 'react-hot-toast';
import RichTextEditor from '../components/editor/RichTextEditor';
import CommentSection from '../components/blog/CommentSection';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await jsonDataService.getBlog(slug);
      setBlog(response.data);
      setEditContent(response.data.content);
    } catch (err) {
      setError('Blog not found');
      toast.error('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like this blog');
      return;
    }

    try {
      const response = await jsonDataService.likeBlog(blog._id);
      setBlog(prevBlog => ({
        ...prevBlog,
        likes: response.data.likes
      }));
      toast.success(response.data.message);
    } catch (err) {
      toast.error('Failed to like blog');
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please login to bookmark this blog');
      return;
    }

    try {
      // TODO: Implement bookmark functionality
      toast.success('Blog bookmarked!');
    } catch (err) {
      toast.error('Failed to bookmark blog');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowActions(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await jsonDataService.updateBlog(blog._id, {
        content: editContent,
      });
      setBlog(response.data);
      setIsEditing(false);
      toast.success('Blog updated successfully!');
    } catch (err) {
      toast.error('Failed to update blog');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(blog.content);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await jsonDataService.deleteBlog(blog._id);
      toast.success('Blog deleted successfully!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete blog');
    }
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    toast.success('Blog reported successfully!');
    setShowActions(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-8">The blog you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const canEdit = user && (user._id === blog.author._id);
  const isLiked = blog.likes?.some(like => like === user?._id || like._id === user?._id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-yellow-600 to-purple-600">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{blog.title}</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">{blog.excerpt}</p>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Blog Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={blog.author.avatar || '/default-avatar.png'}
                alt={blog.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{blog.author.name}</h3>
                <p className="text-gray-600">
                  {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })} • {blog.readTime} min read
                </p>
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-10">
                  {canEdit && (
                    <>
                      <button
                        onClick={handleEdit}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={handleReport}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-orange-600 flex items-center space-x-2"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Report</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Blog Stats */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{blog.likes?.length || 0}</span>
              </button>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <MessageCircle className="w-5 h-5" />
                <span>{blog.comments?.length || 0}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Eye className="w-5 h-5" />
                <span>{blog.views || 0}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleBookmark}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Bookmark"
              >
                <Bookmark className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {isEditing ? (
            <div>
              <RichTextEditor
                value={editContent}
                onChange={setEditContent}
                placeholder="Write your blog content..."
              />
              <div className="flex items-center justify-end space-x-4 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          )}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="font-semibold text-lg mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm hover:bg-yellow-200 transition-colors cursor-pointer"
                >
                  #{typeof tag === 'string' ? tag : (tag?.name || '')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <CommentSection blogId={blog._id} />
      </div>
    </div>
  );
};

export default BlogDetailPage;

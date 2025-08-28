import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, MoreHorizontal, Edit, Trash2, Flag, Send } from 'lucide-react';
import { useAuth } from '../../utils/useAuth.jsx';
import jsonDataService from '../../services/jsonDataService';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Avatar from '../ui/Avatar';

const CommentSection = ({ blogId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showActions, setShowActions] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await jsonDataService.getComments(blogId);
      setComments(response.data);
    } catch (err) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await jsonDataService.createComment(blogId, { content: newComment });
      setComments([response.data, ...comments]);
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      const response = await jsonDataService.createComment(blogId, { content: replyContent, parentComment: replyingTo._id });
      
      // Add reply to the parent comment
      const updatedComments = comments.map(comment => {
        if (comment._id === replyingTo._id) {
          return {
            ...comment,
            replies: [...(comment.replies || []), response.data],
          };
        }
        return comment;
      });
      
      setComments(updatedComments);
      setReplyingTo(null);
      setReplyContent('');
      toast.success('Reply added successfully!');
    } catch (err) {
      toast.error('Failed to add reply');
    }
  };

  const handleEditComment = async () => {
    if (!editContent.trim()) return;

    try {
      const response = await jsonDataService.updateComment(editingComment._id, { content: editContent });
      
      const updatedComments = comments.map(comment => {
        if (comment._id === editingComment._id) {
          return { ...comment, content: response.data.content, isEdited: true };
        }
        return comment;
      });
      
      setComments(updatedComments);
      setEditingComment(null);
      setEditContent('');
      toast.success('Comment updated successfully!');
    } catch (err) {
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await jsonDataService.deleteComment(commentId);
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Comment deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      toast.error('Please login to like comments');
      return;
    }

    try {
      const response = await api.post(`/comments/${commentId}/like`);
      
      const updatedComments = comments.map(comment => {
        if (comment._id === commentId) {
          return { ...comment, likes: response.data.likes };
        }
        return comment;
      });
      
      setComments(updatedComments);
    } catch (err) {
      toast.error('Failed to like comment');
    }
  };

  const handleReportComment = (commentId) => {
    // TODO: Implement report functionality
    toast.success('Comment reported successfully!');
    setShowActions(null);
  };

  const canEditComment = (comment) => {
    return user && (user._id === comment.author._id);
  };

  const canDeleteComment = (comment) => {
    return user && (user._id === comment.author._id);
  };

  const isLiked = (comment) => {
    return comment.likes?.includes(user?._id);
  };

  const renderComment = (comment, isReply = false) => {
    return (
      <div key={comment._id} className={`${isReply ? 'ml-8 mt-3' : 'mb-6'}`}>
        <div className="bg-white rounded-lg border p-4">
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Avatar
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-8 h-8"
              />
              <div>
                <h4 className="font-medium text-gray-900">{comment.author.name}</h4>
                <p className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  {comment.isEdited && <span className="ml-2 text-gray-400">(edited)</span>}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowActions(showActions === comment._id ? null : comment._id)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
              
              {showActions === comment._id && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border py-1 z-10">
                  {canEditComment(comment) && (
                    <button
                      onClick={() => {
                        setEditingComment(comment);
                        setEditContent(comment.content);
                        setShowActions(null);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}
                  {canDeleteComment(comment) && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600 flex items-center space-x-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleReportComment(comment._id)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-orange-600 flex items-center space-x-2"
                  >
                    <Flag className="w-3 h-3" />
                    <span>Report</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comment Content */}
          {editingComment?._id === comment._id ? (
            <div className="mb-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Edit your comment..."
                className="mb-3"
              />
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleEditComment}
                  size="sm"
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent('');
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <p className="text-gray-800 whitespace-pre-wrap">{comment.content}</p>
            </div>
          )}

          {/* Comment Actions */}
          <div className="flex items-center space-x-4 text-sm">
            <button
              onClick={() => handleLikeComment(comment._id)}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked(comment) ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked(comment) ? 'fill-current' : ''}`} />
              <span>{comment.likes?.length || 0}</span>
            </button>
            
            {!isReply && (
              <button
                onClick={() => {
                  setReplyingTo(replyingTo?._id === comment._id ? null : comment);
                  setReplyContent('');
                }}
                className="flex items-center space-x-1 text-gray-500 hover:text-yellow-600 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo?._id === comment._id && (
            <form onSubmit={handleSubmitReply} className="mt-3 pt-3 border-t">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${comment.author.name}...`}
                className="mb-3"
              />
              <div className="flex items-center space-x-2">
                <Button type="submit" size="sm">
                  Reply
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start space-x-3">
            <Avatar
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10"
            />
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="mb-3"
                rows={3}
              />
              <Button type="submit" disabled={!newComment.trim()}>
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-center">
          <p className="text-gray-600 mb-2">Please login to leave a comment</p>
          <Button onClick={() => window.location.href = '/login'}>
            Login
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
};

export default CommentSection;

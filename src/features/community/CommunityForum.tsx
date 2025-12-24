import React, { useState, useEffect } from 'react';
import { CommunityService, ForumPost } from './CommunityService';
import { MonitoringService } from '../../monitoring/MonitoringService';
import { LocalStorageService } from '../../services/LocalStorageService';

interface CommunityForumProps {
  tribe: 'red' | 'yellow' | 'blue' | 'main';
  userEmail?: string;
  userName?: string;
}

const CommunityForum: React.FC<CommunityForumProps> = ({ tribe, userEmail, userName }) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('General Discussion');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = CommunityService.getForumCategories(tribe);
  
  const tribeColors = {
    red: { bg: 'bg-red-lotus', text: 'text-red-lotus', border: 'border-red-lotus' },
    yellow: { bg: 'bg-yellow-lotus', text: 'text-yellow-lotus', border: 'border-yellow-lotus' },
    blue: { bg: 'bg-blue-lotus', text: 'text-blue-lotus', border: 'border-blue-lotus' },
    main: { bg: 'bg-gradient-to-r from-red-lotus via-yellow-lotus to-blue-lotus', text: 'text-white', border: 'border-gray-300' }
  };

  const tribeNames = {
    red: 'Red Lotus (Winter)',
    yellow: 'Yellow Lotus (Summer)', 
    blue: 'Blue Lotus (Spring)',
    main: 'Main Community'
  };

  useEffect(() => {
    loadPosts();
  }, [tribe, selectedCategory]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      
      // Use localStorage only - bypass Firebase completely
      const localPosts = LocalStorageService.getCommunityPosts(tribe, selectedCategory);
      const formattedPosts: ForumPost[] = localPosts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        authorEmail: post.authorEmail || '',
        tribe: post.tribe as any,
        category: post.category || selectedCategory,
        timestamp: { toDate: () => new Date(post.timestamp) } as any,
        replies: 0,
        likes: 0,
        isOfficial: false
      }));
      
      console.log('💬 Loaded community posts:', formattedPosts.length);
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !userName) {
      alert('Please join the tribe first to post in the forum');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Use localStorage only - bypass Firebase completely
      LocalStorageService.addPost({
        title: newPostTitle,
        content: newPostContent,
        author: userName,
        authorEmail: userEmail,
        type: 'community',
        tribe: tribe === 'main' ? 'all' : tribe,
        category: selectedCategory,
        isActive: false // Requires admin approval
      });
      
      console.log('✅ Community post submitted for approval:', {
        title: newPostTitle,
        tribe,
        category: selectedCategory,
        status: 'pending approval'
      });
      
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPost(false);
      
      // Show success message
      alert('Post submitted successfully! It will appear after admin approval.');
      
      loadPosts();
      
      MonitoringService.trackUserAction('forum_post_created', 'community', `${tribe}_${selectedCategory}`);
    } catch (error) {
      console.error('❌ Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (timestamp: any) => {
    const now = new Date();
    const postTime = timestamp.toDate();
    const diffMs = now.getTime() - postTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-black bg-opacity-60 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${tribeColors[tribe].text}`}>
            {tribeNames[tribe]} Forum
          </h2>
          {userEmail && (
            <button
              onClick={() => setShowNewPost(!showNewPost)}
              className={`px-4 py-2 ${tribeColors[tribe].bg} text-white rounded-lg hover:opacity-80 transition`}
            >
              New Post
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                selectedCategory === category
                  ? `${tribeColors[tribe].bg} text-white`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* New Post Form */}
        {showNewPost && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <form onSubmit={handleCreatePost}>
              <input
                type="text"
                placeholder="Post title..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full p-3 mb-3 bg-gray-700 text-white rounded border-none"
                required
              />
              <textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full p-3 mb-3 bg-gray-700 text-white rounded border-none h-24 resize-none"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 ${tribeColors[tribe].bg} text-white rounded hover:opacity-80 transition`}
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPost(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts List */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse text-white">Loading posts...</div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No posts in this category yet. Be the first to start a discussion!
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.isOfficial && (
                        <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded font-bold">
                          OFFICIAL
                        </span>
                      )}
                      <h3 className="text-white font-semibold">{post.title}</h3>
                    </div>
                    <p className="text-gray-300 mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>by {post.author}</span>
                      <span>{formatTimeAgo(post.timestamp)}</span>
                      <span>{post.replies} replies</span>
                      <span>{post.likes} likes</span>
                    </div>
                  </div>
                  <div className={`w-1 h-16 ${tribeColors[tribe].bg} rounded`}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!userEmail && (
          <div className="mt-6 p-4 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg">
            <p className="text-yellow-200 text-center">
              Join the {tribeNames[tribe]} to participate in discussions and connect with fellow members!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityForum;
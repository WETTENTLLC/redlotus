import React, { useState, useEffect } from 'react';
import { LocalStorageService, LocalPost } from '../services/LocalStorageService';

interface ContentDisplayProps {
  section: 'hut' | 'music' | 'vibrate' | 'tribe' | 'bts' | 'store' | 'live' | 'community';
  tribe?: 'red' | 'yellow' | 'blue' | 'all';
  maxPosts?: number;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ section, tribe = 'all', maxPosts = 5 }) => {
  const [posts, setPosts] = useState<LocalPost[]>([]);

  useEffect(() => {
    const loadPosts = () => {
      let sectionPosts = LocalStorageService.getPostsBySection(section);
      
      // Filter by tribe if specified
      if (tribe !== 'all') {
        sectionPosts = sectionPosts.filter(post => 
          post.tribe === tribe || post.tribe === 'all'
        );
      }
      
      // Sort by pinned first, then by timestamp
      sectionPosts.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      
      setPosts(sectionPosts.slice(0, maxPosts));
    };

    loadPosts();
    
    // Listen for storage changes
    const handleStorageChange = () => loadPosts();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [section, tribe, maxPosts]);

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4 mb-6">
      {posts.map((post) => (
        <div key={post.id} className={`bg-black bg-opacity-60 rounded-lg p-4 border-l-4 ${
          post.isPinned ? 'border-l-yellow-500 bg-yellow-500 bg-opacity-10' : 'border-l-blue-500'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{post.title}</h3>
              {post.isPinned && (
                <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                  📌 PINNED
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400">
              {new Date(post.timestamp).toLocaleDateString()}
            </div>
          </div>
          
          <div className="text-gray-200 mb-3">
            {post.content.length > 200 ? (
              <>
                {post.content.substring(0, 200)}...
                <button className="text-blue-400 hover:text-blue-300 ml-2">
                  Read more
                </button>
              </>
            ) : (
              post.content
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>By {post.author}</span>
            {post.tribe && post.tribe !== 'all' && (
              <span className={`px-2 py-1 rounded ${
                post.tribe === 'red' ? 'bg-red-500 bg-opacity-20 text-red-300' :
                post.tribe === 'yellow' ? 'bg-yellow-500 bg-opacity-20 text-yellow-300' :
                'bg-blue-500 bg-opacity-20 text-blue-300'
              }`}>
                {post.tribe === 'red' ? '❄️ Red Lotus' : 
                 post.tribe === 'yellow' ? '☀️ Yellow Lotus' : 
                 '🌸 Blue Lotus'}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentDisplay;
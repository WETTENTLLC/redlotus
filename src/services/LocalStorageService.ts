// Simple local storage service for posts until Firebase is properly configured
export interface LocalPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorEmail?: string;
  type: 'community' | 'admin';
  tribe?: 'red' | 'yellow' | 'blue' | 'all';
  section?: string;
  category?: string;
  timestamp: string;
  isActive: boolean;
  isPinned?: boolean;
}

export class LocalStorageService {
  private static POSTS_KEY = 'redlotus_posts';

  static getAllPosts(): LocalPost[] {
    try {
      const posts = localStorage.getItem(this.POSTS_KEY);
      return posts ? JSON.parse(posts) : [];
    } catch (error) {
      console.error('Error loading posts:', error);
      return [];
    }
  }

  static addPost(post: Omit<LocalPost, 'id' | 'timestamp'>): LocalPost {
    const newPost: LocalPost = {
      ...post,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    const posts = this.getAllPosts();
    posts.unshift(newPost);
    localStorage.setItem(this.POSTS_KEY, JSON.stringify(posts));
    
    return newPost;
  }

  static getPostsByType(type: 'community' | 'admin'): LocalPost[] {
    return this.getAllPosts().filter(post => post.type === type);
  }

  static getPostsBySection(section: string): LocalPost[] {
    return this.getAllPosts().filter(post => 
      post.type === 'admin' && 
      post.section === section && 
      post.isActive
    );
  }

  static getPostsByTribe(tribe: 'red' | 'yellow' | 'blue' | 'all'): LocalPost[] {
    return this.getAllPosts().filter(post => 
      post.tribe === tribe || post.tribe === 'all'
    );
  }

  static getCommunityPosts(tribe: 'red' | 'yellow' | 'blue' | 'main', category?: string): LocalPost[] {
    return this.getAllPosts().filter(post => {
      if (post.type !== 'community') return false;
      if (tribe !== 'main' && post.tribe !== tribe) return false;
      if (category && post.category !== category) return false;
      return true;
    });
  }

  static updatePost(id: string, updates: Partial<LocalPost>): boolean {
    const posts = this.getAllPosts();
    const index = posts.findIndex(post => post.id === id);
    
    if (index === -1) return false;
    
    posts[index] = { ...posts[index], ...updates };
    localStorage.setItem(this.POSTS_KEY, JSON.stringify(posts));
    return true;
  }

  static deletePost(id: string): boolean {
    const posts = this.getAllPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    
    if (filteredPosts.length === posts.length) return false;
    
    localStorage.setItem(this.POSTS_KEY, JSON.stringify(filteredPosts));
    return true;
  }
}
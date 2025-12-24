import { db } from '../../firebase/config';
import { collection, addDoc, getDocs, query, orderBy, where, limit, Timestamp } from 'firebase/firestore';
import { SecurityService } from '../../security/SecurityService';

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  tribe?: 'red' | 'yellow' | 'blue' | 'main';
  category: string;
  timestamp: Timestamp;
  replies: number;
  likes: number;
  isOfficial?: boolean;
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  author: string;
  authorEmail: string;
  timestamp: Timestamp;
  likes: number;
}

export class CommunityService {
  static async createPost(
    title: string,
    content: string,
    author: string,
    authorEmail: string,
    tribe: 'red' | 'yellow' | 'blue' | 'main',
    category: string,
    isOfficial = false
  ): Promise<string> {
    // Security validation
    const sanitizedTitle = SecurityService.sanitizeInput(title);
    const sanitizedContent = SecurityService.sanitizeInput(content);
    const sanitizedAuthor = SecurityService.sanitizeInput(author);
    
    if (!SecurityService.validateEmail(authorEmail)) {
      throw new Error('Invalid email address');
    }

    // Rate limiting
    if (!SecurityService.checkRateLimit(authorEmail, 5, 300000)) {
      throw new Error('Too many posts. Please wait before posting again.');
    }

    const postData = {
      title: sanitizedTitle,
      content: sanitizedContent,
      author: sanitizedAuthor,
      authorEmail,
      tribe,
      category,
      timestamp: Timestamp.now(),
      replies: 0,
      likes: 0,
      isOfficial
    };

    const docRef = await addDoc(collection(db, 'forumPosts'), postData);
    return docRef.id;
  }

  static async getPosts(tribe: 'red' | 'yellow' | 'blue' | 'main', category?: string): Promise<ForumPost[]> {
    let q = query(
      collection(db, 'forumPosts'),
      where('tribe', '==', tribe),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    if (category) {
      q = query(
        collection(db, 'forumPosts'),
        where('tribe', '==', tribe),
        where('category', '==', category),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
    }

    const snapshot = await getDocs(q);
    const posts: ForumPost[] = [];
    
    snapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data() as Omit<ForumPost, 'id'>
      });
    });

    return posts;
  }

  static async addReply(
    postId: string,
    content: string,
    author: string,
    authorEmail: string
  ): Promise<string> {
    const sanitizedContent = SecurityService.sanitizeInput(content);
    const sanitizedAuthor = SecurityService.sanitizeInput(author);
    
    if (!SecurityService.validateEmail(authorEmail)) {
      throw new Error('Invalid email address');
    }

    if (!SecurityService.checkRateLimit(authorEmail, 10, 300000)) {
      throw new Error('Too many replies. Please wait before replying again.');
    }

    const replyData = {
      postId,
      content: sanitizedContent,
      author: sanitizedAuthor,
      authorEmail,
      timestamp: Timestamp.now(),
      likes: 0
    };

    const docRef = await addDoc(collection(db, 'forumReplies'), replyData);
    return docRef.id;
  }

  static async getReplies(postId: string): Promise<ForumReply[]> {
    const q = query(
      collection(db, 'forumReplies'),
      where('postId', '==', postId),
      orderBy('timestamp', 'asc')
    );

    const snapshot = await getDocs(q);
    const replies: ForumReply[] = [];
    
    snapshot.forEach((doc) => {
      replies.push({
        id: doc.id,
        ...doc.data() as Omit<ForumReply, 'id'>
      });
    });

    return replies;
  }

  static getForumCategories(tribe: 'red' | 'yellow' | 'blue' | 'main'): string[] {
    const commonCategories = ['General Discussion', 'Music Talk', 'Fan Art', 'Events'];
    
    const tribeSpecific = {
      red: ['Winter Motivation', 'Focus Sessions', 'Rap & Hip-Hop'],
      yellow: ['Summer Vibes', 'Positivity Corner', 'Pop & Dance'],
      blue: ['Spring Renewal', 'Meditation', 'R&B & Soul'],
      main: ['Announcements', 'Red Lotus News', 'Cross-Tribe Chat', 'Feedback']
    };

    return [...commonCategories, ...tribeSpecific[tribe]];
  }
}
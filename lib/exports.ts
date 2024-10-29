// Post types
export type User = {
  id: number;
  email: string;
  username: string;
  bio: string;
  profile_picture: string;
  website: string;
  gender: string;
};

export type Comment = {
  id: number;
  owner: User;
  post: number;
  comment: string | null;
  comment_image?: string | null;
  created_at: Date;
};

export type Like = {
  id: number;
  user: User;
  post: number;
  created_at: Date | null;
};

export type Bookmark = {
  id: number;
  user: User;
  post: number;
  created_at: Date | null;
};

export type Post = {
  id: number;
  author: User;
  fileUrl: string;
  caption: string | null;
  created_at: Date;
  comments: Comment[];
  comments_count: number;
  likes: Like[];
  likes_count: number;
  bookmarks: Bookmark[];
  bookmark_count: number;
};

// Profile types
export type ProfileData = {
  profile: {
    id: number;
    email: string;
    username: string;
    bio: string;
    profile_picture: string;
    website: string;
    gender: string;
  };
  following: any[];
  followers: any[];
  posts: Post[];
  following_count: number;
  followers_count: number;
};

// Conversations type
export type Conversations = {
  id: string;
  users: User[];
};

export type MessageType = {
  id: string;
  name: string;
  body: string;
  send_to: User;
  created_by: User;
};

export type ConversationData = {
  conversation: {
    id: string;
    users: User[];
  };
  messages: MessageType[];
};

export interface Comment {
  user: string;
  message: string;
  date: string;
}


export interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorBio?: string;
  authorAvatar?: string;
  postedDate: string;
  updatedDate?: string;
  likeCount: number;
  image: string;
  category: string;
  readTime: string;
  tags?: string[];
  comments?: Comment[];
  commentCount?: number;
  viewCount?: number;
  featured?: boolean;
}

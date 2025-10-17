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
  postedDate: string;
  likeCount: number;
  image: string;
  comments?: Comment[];
}

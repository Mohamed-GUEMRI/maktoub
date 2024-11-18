export interface Article {
    id: number;
    authorId: number;
    title: string;
    subtitle: string;
    content: string;
    createdAt: Date;
    publishedAt?: Date;
    viewCount: number;
    likeCount: number;
    isDeleted: boolean;
    author: any;   // Define author structure or replace `any` with your author model
    comments: any[]; // Define comments structure
    bookmarks: any[]; // Define bookmarks structure
    tags: string[];
    categories: number;
  }
  
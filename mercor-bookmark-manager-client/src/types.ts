export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  createdAt: string;
}

export interface BookmarkFormData {
  title: string;
  url: string;
  description: string;
  tags: string[];
}

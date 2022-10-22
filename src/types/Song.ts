export interface Song {
  uid: string;
  display_name: string;
  original_name: string;
  modified_name: string;
  genre?: string;
  comment_count: number;
  url: string;
  docId?: string;
}

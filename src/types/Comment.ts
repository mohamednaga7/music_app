export interface Comment {
  content: string;
  datePosted: number;
  sid: string;
  name: string;
  uid: string;
  docId?: string;
  readableDate?: string;
}

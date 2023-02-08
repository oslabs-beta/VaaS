export interface IChart {
  id: number;
  uid: string;
  title: string;
  uri?: string;
  url?: string;
  slug?: string;
  type?: string;
  tags?: string[];
  isStarred?: boolean;
  sortMeta?: number;
}

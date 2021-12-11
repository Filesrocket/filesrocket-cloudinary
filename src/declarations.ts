import { Pagination, Query } from "filesrocket";
import { ConfigOptions, UploadApiResponse } from "cloudinary";

export interface CloudinaryOptions extends ConfigOptions {
  pagination: Pagination;
}

export interface FileResults extends Query {
  total_count: number;
  next_cursor: string;
  resources: UploadApiResponse[];
}

export interface FolderResults extends Query {
  folders: { name: string; path: string }[];
  next_cursor: string;
  total_count: number;
}

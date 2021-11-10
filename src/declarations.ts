import { Pagination, Query } from "filesrocket";
import { ConfigOptions, UploadApiResponse } from "cloudinary";

export interface CloudinaryOptions extends ConfigOptions {
  pagination: Pagination;
}

export interface CloudinaryResult extends Query {
  total_count: number;
  next_cursor: string;
  resources: UploadApiResponse[];
}

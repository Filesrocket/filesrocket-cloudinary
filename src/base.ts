import { Paginated, Query, Result } from "filesrocket";
import { UploadApiResponse } from "cloudinary";

import { CloudinaryOptions, CloudinaryResult } from "./index";

export class BaseCloudinaryRocket {
  constructor(protected readonly options: CloudinaryOptions) {}

  protected paginate(data: CloudinaryResult): Paginated<Result> {
    const items: Result[] = data.resources.map(this.builder);
    const { pagination } = this.options;
    
    return {
      items,
      size: data.resources.length || pagination.default,
      total: data.total_count,
      pageToken: null,
      nextPageToken: data.next_cursor || null,
      prevPageToken: null
    }
  }
    
  protected builder(payload: UploadApiResponse): Result & Query {
    return {
      ...payload,
      name: payload.filename || payload.public_id,
      size: payload.bytes,
      dir: payload.folder || "",
      ext: `.${ payload.format }`,
      url: payload.secure_url,
      createdAt: new Date(payload.created_at),
      updatedAt: new Date(payload.updatedAt)
    }
  }
}

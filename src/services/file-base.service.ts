import { Paginated, ResultEntity } from "filesrocket";
import { UploadApiResponse } from "cloudinary";

import { CloudinaryOptions, FileResults } from "../index";

export class FileBaseService {
  constructor(protected readonly options: CloudinaryOptions) {}

  protected paginate(data: FileResults): Paginated<ResultEntity> {
    const items: ResultEntity[] = data.resources.map(this.builder);
    const { pagination } = this.options;
    
    return {
      items,
      size: data.resources.length || pagination.default,
      total: data.total_count,
      page: undefined,
      nextPageToken: data.next_cursor,
      prevPageToken: undefined
    }
  }
    
  protected builder(payload: UploadApiResponse): ResultEntity {
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

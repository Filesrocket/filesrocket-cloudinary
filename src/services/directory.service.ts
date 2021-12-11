import { DirectoryEntity, ResultEntity, Paginated, Query, ServiceMethods } from "filesrocket/lib";
import { createHttpError } from "filesrocket/lib/errors";
import { Service } from "filesrocket/lib/common";
import cloudinary from "cloudinary";

import { CloudinaryOptions, FolderResults } from "../declarations";

@Service({
  name: "cloudinary",
  type: "Directories"
})
export class DirectoryService implements ServiceMethods<DirectoryEntity> {
  constructor(private readonly options: CloudinaryOptions) {
    cloudinary.v2.config(options);
  }

  private builder(entity: any): ResultEntity {
    return {
      ...entity,
      name: entity.name,
      dir: entity.path,
      createdAt: entity.rate_limit_reset_at
    };
  }

  pagination(data: FolderResults): Paginated<ResultEntity> {
    const { folders, next_cursor, total_count } = data;
    const items = folders.map(this.builder);

    return {
      items,
      size: items.length,
      total: total_count,
      page: undefined,
      nextPageToken: next_cursor,
      prevPageToken: undefined
    };
  }

  async create(data: DirectoryEntity, __?: Query): Promise<ResultEntity> {
    return new Promise((resolve, reject) => {
      const callback = (err: any, result: any) => {
        if (err || !result) return reject(
          createHttpError(err?.http_code, err?.message)
        );
        resolve(result);
      }

      cloudinary.v2.api.create_folder(data.name, {}, callback);
    });
  }

  async list(query: Query = {}): Promise<Paginated<ResultEntity> | ResultEntity[]> {
    return new Promise((resolve, reject) => {
      const { pagination } = this.options;
      const max_results: number = query.size <= pagination.max
        ? query.size
        : pagination.default;

      const callback = (err: any, result: FolderResults) => {
        if (err || !result) return reject(
          createHttpError(err?.http_code, err?.message)
        );
        resolve(this.pagination(result));
      }

      const options = { max_results, next_cursor: query.page };

      if (!query.path) {
        cloudinary.v2.api.root_folders(options as any, callback);
        return;
      }

      cloudinary.v2.api.sub_folders(query.path, options, callback);
    });
  }

  // Remove recursive directories.
  async remove(id: string, query: Query = {}): Promise<ResultEntity> {
    console.log(id);

    if (query.bulk) {
      cloudinary.v2.search.expression(`folder=${ id }`).execute();
    }

    return {} as any;
  }
}

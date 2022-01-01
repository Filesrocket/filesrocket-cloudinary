import { DirectoryEntity, ResultEntity, Paginated, Query, ServiceMethods } from "filesrocket";
import { createHttpError } from "filesrocket/lib/errors";
import { Service } from "filesrocket/lib/common";
import cloudinary from "cloudinary";

import { CloudinaryOptions, FolderResults } from "../declarations";
import { BaseService } from "../base";

@Service({
  name: "cloudinary",
  type: "Directories"
})
export class DirectoryService extends BaseService implements ServiceMethods<DirectoryEntity> {
  constructor(private readonly options: CloudinaryOptions) {
    super();
    cloudinary.v2.config(options);
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
        
        resolve(this.pagination({
          ...result,
          resources: result.folders
        }, this.builder) as any);
      }

      const options = { max_results, next_cursor: query.page };

      if (!query.path) {
        cloudinary.v2.api.root_folders(options as any, callback);
        return;
      }

      cloudinary.v2.api.sub_folders(query.path, options, callback);
    });
  }

  async remove(id: string): Promise<Partial<ResultEntity>> {
    return new Promise((resolve, reject) => {
      const callback = (err: any, result: any) => {
        if (err || !result) return reject(
          createHttpError(err?.http_code, err?.message)
        );
  
        const chunks: string[] = id.split("/");
        const name = chunks[chunks.length - 1];
  
        resolve({ ...result, id, name, dir: id });
      }

      cloudinary.v2.api.delete_folder(id, {}, callback);
    });
  }

  private builder(entity: any): ResultEntity {
    return {
      ...entity,
      id: entity.path,
      name: entity.name,
      dir: entity.path,
      createdAt: entity.rate_limit_reset_at
    };
  }
}

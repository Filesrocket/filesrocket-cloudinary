import {
  ServiceMethods,
  Paginated,
  Payload,
  Result,
  Query
} from "filesrocket";
import { NotFound, BadRequest } from "http-errors";
import cloudinary, { UploadApiResponse } from "cloudinary";

import { convertToExpression, ParseFilename, removeProperties } from "./utils";
import { CloudinaryOptions, CloudinaryResult } from "./index";
import { BaseCloudinaryRocket } from "./base";

export class CloudinaryRocketService extends BaseCloudinaryRocket
  implements Partial<ServiceMethods<Payload, Result>> {
  constructor(options: CloudinaryOptions) {
    super(options);
    cloudinary.v2.config(options);
  }

  @ParseFilename()
  async create(data: Payload, query: Query): Promise<Result> {
    return new Promise((resolve, reject) => {
      const updatedQuery: Partial<Query> = removeProperties(query, [
        "service",
        "path"
      ]);

      const callback = (err: any, result: UploadApiResponse | undefined) => {
        !result || err ? reject(err) : resolve(this.builder(result));
      };

      const props = {
        resource_type: "auto",
        ...updatedQuery,
        folder: query.path,
        public_id: data.filename
      };

      const uploader = cloudinary.v2.uploader.upload_stream(props, callback);

      data.file.pipe(uploader);
    });
  }

  async list(query: Query): Promise<Paginated<Result>> {
    return new Promise((resolve, reject) => {
      const { pagination } = this.options;
      const paginate: number = query.size <= pagination.max
        ? query.size
        : pagination.default;
  
      const updatedQuery: Partial<Query> = removeProperties(query, [
        "service",
        "page",
        "size",
        "path"
      ]);
      const exp: string = convertToExpression(
        { ...updatedQuery, folder: query.path },
        " AND "
      );
  
      cloudinary.v2.search
        .expression(exp)
        .max_results(paginate)
        .next_cursor(query.page)
        .execute()
        .then(result => resolve(this.paginate(result)))
        .catch(err => reject(new BadRequest(err?.error.message)));
    });
  }

  async get(id: string, query: Query): Promise<Result & Query> {
    return new Promise((resolve, reject) => {
      const updatedQuery: Partial<Query> = removeProperties(
        { ...query, public_id: id } as Query,
        ["service", "path"]
      );
      const exp: string = convertToExpression(
        { ...updatedQuery, folder: query.path },
        " AND "
      );

      cloudinary.v2.search
        .expression(exp)
        .execute()
        .then(({ resources }: CloudinaryResult) => {
          !resolve.length
            ? reject(new NotFound("The file does not exist."))
            : resolve(this.builder(resources[0]));
        })
        .catch(err => reject(new BadRequest(err?.error.message)));
    });
  }

  async remove(path: string, query: Query): Promise<Result> {
    const file = await this.get(path, query);
    const { resource_type } = file;

    const updatedQuery: Partial<Query> = removeProperties(query, [
      "service",
      "path"
    ]);
    const params = { resource_type, ...updatedQuery, folder: query.path };

    return new Promise(async (resolve, reject) => {
      cloudinary.v2.api
        .delete_resources([path], params)
        .then(() => resolve(file))
        .catch((err) => reject(new BadRequest(err?.error.message)));
    });
  }
}
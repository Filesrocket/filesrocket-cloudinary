import { Paginated, Payload, Query, Result, ServiceMethods } from "filesrocket";
import { NotFound, BadRequest } from "http-errors";
import cloudinary from "cloudinary";

import { convertToExpression, removeProperties } from "./utils";
import { CloudinaryOptions, CloudinaryResult } from "./index";
import { BaseCloudinaryRocket } from "./base";

export class CloudinaryRocketService extends BaseCloudinaryRocket
  implements Partial<ServiceMethods<Payload, Result>> {
  constructor(options: CloudinaryOptions) {
    super(options);
    cloudinary.v2.config(options);
  }

  async create(data: Payload, query: Query): Promise<Result> {
    return new Promise((resolve, reject) => {
      query = removeProperties(query, ["service"]);

      const uploader = cloudinary.v2.uploader.upload_stream(
        { resource_type: "auto", ...query },
        (err, result) => {
          (!result || err) ? reject(err) : resolve(this.builder(result));
        }
      );

      data.file.pipe(uploader);
    });
  }

  async list(query: Query): Promise<Paginated<Result>> {
    return new Promise((resolve, reject) => {
      const { pagination } = this.options;
      const paginate: number = query.size <= pagination.max
        ? query.size
        : pagination.default;
  
      const updatedQuery = removeProperties(
        Object.assign({}, query),
        ["service", "page", "size"]
      );
      const exp: string = convertToExpression(updatedQuery, " AND ");
  
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
      const updatedQuery = removeProperties(
        { ...query, public_id: id } as Query,
        ["service", "path"]
      );
      const exp: string = convertToExpression(updatedQuery, " AND ");

      cloudinary.v2.search
        .expression(exp)
        .execute()
        .then(({ resources }: CloudinaryResult) => {
          if (!resources.length) {
            return reject(new NotFound("The file does not exist."));
          }
          resolve(this.builder(resources[0]));
        })
        .catch(err => {
          reject(new BadRequest(err?.error.message));
        });
    });
  }

  async remove(id: string, query: Query): Promise<Result> {
    const file = await this.get(id, query);
    const { resource_type } = file;

    const updatedQuery = removeProperties(query, ["service", "path"]);
    const params = { resource_type, ...updatedQuery };

    return new Promise(async (resolve, reject) => {
      cloudinary.v2.api.delete_resources([id], params)
        .then(() => resolve(file))
        .catch(err => reject(new BadRequest(err?.error.message)));
    });
  }
}
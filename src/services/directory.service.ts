import { DirectoryEntity, ResultEntity, Paginated, Query, ServiceMethods } from "filesrocket/lib";
import { Service } from "filesrocket/lib/common";

@Service({
  name: "cloudinary",
  type: "Directories"
})
export class DirectoryService implements ServiceMethods<DirectoryEntity> {
  create(_: DirectoryEntity, __?: Query): Promise<ResultEntity> {
    return new Promise((_, reject) => {
      reject(new Error("Method not implemented"));
    });
  }

  list(query?: Query): Promise<Paginated<ResultEntity> | ResultEntity[]> {
    return new Promise((_, reject) => {
      console.log(query);
      reject(new Error("Method not implemented"));
    });
  }

  get(id: string, query?: Query): Promise<ResultEntity> {
    console.log("Id: ", id);
    console.log("Query: ", query);
    throw new Error("Method not implemented.");
  }

  remove(id: string, query?: Query): Promise<ResultEntity> {
    console.log("Id: ", id);
    console.log("Query: ", query);
    throw new Error("Method not implemented.");
  }
}

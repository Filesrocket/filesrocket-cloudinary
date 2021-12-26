import { Query, ResultEntity } from "filesrocket";
import { createReadStream } from "fs";
import { parse } from "path";

import { fileService } from "../config/service";

const FOLDER_NAME: string = "filesrocket-test";

export async function uploadFile(
  path: string,
  folder: string = FOLDER_NAME
) {
  const stream = createReadStream(path);
  const { base: name } = parse(path);
  const options = { path: folder };

  return fileService.create({
    name,
    stream,
    fieldname: "files",
    encoding: "",
    mimetype: ""
  }, options);
}

export async function uploadManyFiles(
  paths: string[],
  folder: string = FOLDER_NAME
): Promise<ResultEntity[]> {
  const promises = paths.map(path => uploadFile(path, folder));
  return Promise.all(promises);
}

export async function getFiles(query: Query = {}) {
  return fileService.list({
    path: FOLDER_NAME,
    ...query
  });
}

export async function deleteOneFile(path: string) {
  return fileService.remove(path);
}

export async function deleteManyFiles(paths: string[]) {
  return Promise.all(paths.map(path => fileService.remove(path)));
}

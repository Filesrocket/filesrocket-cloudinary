import { Paginated, ResultEntity } from "filesrocket";
import { resolve } from "path";
jest.mock("filesrocket");

import {
  deleteManyFiles,
  deleteOneFile,
  getFiles,
  uploadFile,
  uploadManyFiles
} from "../helpers/file.helper";

const FILENAMES: string[] = [
  "one.png",
  "two.png",
  "three.png",
  "four.png",
  "five.png"
];

beforeAll(() => {
  jest.setTimeout((60 * 10) * 1000);
});

describe("Uploading files", () => {
  test("Upload many files", async () => {
    const paths: string[] = FILENAMES.map(
      name => resolve(`test/fixtures/${name}`)
    );
    const results: ResultEntity[] = await uploadManyFiles(paths);
    expect(results).toHaveLength(FILENAMES.length);
  });

  test("Upload single file", async () => {
    const path: string = resolve(`test/fixtures/${FILENAMES[0]}`);
    const entity: ResultEntity = await uploadFile(path);
    expect(typeof entity).toBe("object");
  });
});

describe("Getting files", () => {
  test("Get many files", async () => {
    const data: Paginated<ResultEntity> = await getFiles();
    expect(data.items.length).toBeGreaterThan(1);
  });

  test("Get 3 files", async () => {
    const SIZE: number = 3;
    const data: Paginated<ResultEntity> = await getFiles({ size: SIZE });
    expect(data.items).toHaveLength(SIZE);
  });
});

describe("Deleting files", () => {
  test("Delete single file", async () => {
    const data: Paginated<ResultEntity> = await getFiles({ size: 1 });
    const file: ResultEntity = data.items[0];

    const entity: ResultEntity = await deleteOneFile(file.public_id);
    expect(entity.name).toBe(file.name);
  });

  test("Delete many files", async () => {
    const data: Paginated<ResultEntity> = await getFiles();
    
    const paths: string[] = data.items.map(item => item.public_id);
    const results: ResultEntity[] = await deleteManyFiles(paths);
    
    expect(results).toHaveLength(data.items.length);
  });
});

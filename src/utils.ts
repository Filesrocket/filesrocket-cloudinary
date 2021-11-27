import { generateRandomFilename, Payload } from "filesrocket";
import { exts } from "./dump";

export function removeProperties<T, K extends keyof T>(
  payload: T,
  properties: K[]
): Partial<T> {
  const entity: T = Object.assign({}, payload);
  properties.forEach((p) => delete entity[p]);
  return entity;
}

export function convertToExpression<T>(payload: T, join: string) {
  const keys: string[] = Object.keys(payload);
  if (!keys.length) return "";

  let items: string[] = [];

  keys.forEach((key: string): void => {
    const value = payload[key as keyof T] as any;
    if (!value) return;

    if (key.match(/^_/)) {
      items.push(value);
      return;
    }
    items.push(`${key}=${value}`);
  });

  return items.join(join);
}

/**
 * Generate a random filename with or without an 
 * extension depending on the file type.
 * 
 * **Example**
 * - history.pptx -> history-186dgs.pptx
 * - image.jpg -> image-326gds
 * - video.mp4 -> video-434gas
 * - audio.jpg -> audio-149gds
 * 
 * For more information visit: https://cloudinary.com/documentation/image_upload_api_reference#upload_optional_parameters
 */
export function ParseFilename() {
  return function (
    _: Object,
    __: string | symbol,
    descriptor: PropertyDescriptor
  ): void {
    let original = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const payload = args[0] as Payload;

      const dictionary: Record<string, string> = Object.assign(
        {},
        ...exts.map(item => ({ [item]: item }))
      );
      const filename: string = generateRandomFilename(payload.filename);
      
      const [_, name, ext] = filename.match(/(.+?)(\.[^.]*$|$)/) || [];
      if (dictionary[ext]) payload.filename = name;

      args[0] = payload;

      return original.apply(this, args);
    }
  }
}

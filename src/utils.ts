import { parse } from 'path'
import { exts } from './dump'

export function convertToExpression<T> (payload: T, join: string) {
  const keys: string[] = Object.keys(payload)
  if (!keys.length) return ''

  const items: string[] = []

  keys.forEach((key: string): void => {
    const value = payload[key as keyof T] as any
    if (!value) return

    if (key.match(/^_/)) {
      items.push(value)
      return
    }
    items.push(`${key}=${value}`)
  })

  return items.join(join)
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
export function CustomFilename (filename: string): string {
  const dictionary: Record<string, string> = Object.assign(
    {},
    ...exts.map(item => ({ [item]: item }))
  )

  const { name, ext } = parse(filename)
  if (dictionary[ext]) filename = name

  return filename
}

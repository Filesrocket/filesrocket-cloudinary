import { Query, OutputEntity } from 'filesrocket'
import { createReadStream } from 'fs'
import { parse } from 'path'

import service from '../config/service'

const FOLDER_NAME: string = 'filesrocket-test'

export async function uploadFile (
  path: string,
  folder: string = FOLDER_NAME
) {
  const stream = createReadStream(path)
  const { base: name } = parse(path)
  const options = { path: folder }

  return service.create({
    name,
    stream,
    fieldname: 'files',
    encoding: '',
    mimetype: ''
  }, options)
}

export async function uploadManyFiles (
  paths: string[],
  folder: string = FOLDER_NAME
): Promise<OutputEntity[]> {
  const promises = paths.map(path => uploadFile(path, folder))
  return Promise.all(promises)
}

export async function getFiles (query: Query = {}) {
  return service.list({
    path: FOLDER_NAME,
    ...query
  })
}

export async function deleteOneFile (path: string) {
  return service.remove(path)
}

export async function deleteManyFiles (paths: string[]) {
  return Promise.all(paths.map(
    path => service.remove(path))
  )
}

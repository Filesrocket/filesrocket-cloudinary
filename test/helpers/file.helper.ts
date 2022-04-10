import { Query, OutputEntity } from 'filesrocket'
import { createReadStream } from 'fs'
import { parse } from 'path'

import service from '../config/service'

const FOLDER_NAME: string = 'filesrocket-test'

export async function upload (
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

export async function uploadMany (
  paths: string[],
  folder: string = FOLDER_NAME
): Promise<OutputEntity[]> {
  const promises = paths.map(path => upload(path, folder))
  return Promise.all(promises)
}

export function findOne (id: string, query: Query = {}) {
  return service.get(id)
}

export async function find (query: Query = {}) {
  return service.list({
    path: FOLDER_NAME,
    ...query
  })
}

export async function remove (paths: string[]) {
  return Promise.all(paths.map(
    path => service.remove(path))
  )
}

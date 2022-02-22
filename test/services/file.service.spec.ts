import { ResultEntity } from '@filesrocket/filesrocket'
import { resolve } from 'path'

import {
  deleteManyFiles,
  deleteOneFile,
  getFiles,
  uploadFile,
  uploadManyFiles
} from '../helpers/file.helper'
jest.mock('@filesrocket/filesrocket')

const FILENAMES: string[] = [
  'one.png',
  'two.png',
  'three.png',
  'four.png',
  'five.png'
]

beforeAll(() => jest.setTimeout((60 * 10) * 1000))

describe('Uploading files', () => {
  test('Upload many files', async () => {
    const paths = FILENAMES.map(name => resolve(`test/fixtures/${name}`))
    const results = await uploadManyFiles(paths)
    expect(results).toHaveLength(FILENAMES.length)
  })

  test('Upload single file', async () => {
    const path: string = resolve(`test/fixtures/${FILENAMES[0]}`)
    const entity = await uploadFile(path)
    expect(typeof entity).toBe('object')
  })
})

describe('Getting files', () => {
  test('Get many files', async () => {
    const data = await getFiles()
    const items = Array.isArray(data) ? data : data.items
    expect(items.length).toBeGreaterThan(1)
  })

  test('Get 3 files', async () => {
    const SIZE = 3
    const data = await getFiles({ size: SIZE })
    const items = Array.isArray(data) ? data : data.items
    expect(items).toHaveLength(SIZE)
  })
})

describe('Deleting files', () => {
  test('Delete single file', async () => {
    const data = await getFiles({ size: 1 })
    const items = Array.isArray(data) ? data : data.items
    const file = items[0]

    const entity = await deleteOneFile(file.id)
    expect(entity.name).toBe(file.name)
  })

  test('Delete many files', async () => {
    const data = await getFiles()
    const items = Array.isArray(data) ? data : data.items

    const paths: string[] = items.map(item => item.id)
    const results: ResultEntity[] = await deleteManyFiles(paths)

    expect(results).toHaveLength(items.length)
  })
})

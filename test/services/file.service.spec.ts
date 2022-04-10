import { OutputEntity } from 'filesrocket'
import { resolve } from 'path'

import {
  uploadMany,
  findOne,
  find,
  remove
} from '../helpers/file.helper'

jest.mock('filesrocket')

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

    const results = await uploadMany(paths)

    expect(results).toHaveLength(FILENAMES.length)
  })
})

describe('Getting files', () => {
  test('Get many files', async () => {
    const data = await find()
    expect(data.items.length).toBeGreaterThan(1)
  })

  test('Get 2 files', async () => {
    const SIZE = 2

    const data = await find({ size: SIZE })

    expect(data.items).toHaveLength(SIZE)
  })

  test('Get a file when id is empty', async () => {
    await expect(findOne('')).rejects.toThrowError('Id is empty')
  })
})

describe('Deleting files', () => {
  test('Delete single file', async () => {
    const data = await find({ size: 1 })
    const file = data.items[0]

    const entities = await remove([file.id])
    const entity = entities[0]

    expect(entity.name).toBe(file.name)
  })

  test('Delete many files', async () => {
    const data = await find()

    const paths: string[] = data.items.map(item => item.id)
    const results: OutputEntity[] = await remove(paths)

    expect(results).toHaveLength(data.items.length)
  })
})

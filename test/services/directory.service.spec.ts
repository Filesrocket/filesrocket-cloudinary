import { Paginated, ResultEntity } from 'filesrocket'

import { environments } from '../config/environments'
import { directoryService } from '../config/service'
jest.mock('filesrocket')

const FOLDER_NAMES: string[] = [
  'images',
  'documents',
  'videos',
  'audios'
]

beforeAll(() => jest.setTimeout((60 * 10) * 1000))

describe('Creating directories', () => {
  test('Create many directories', async () => {
    const items: ResultEntity[] = await Promise.all(
      FOLDER_NAMES.map(name => {
        return directoryService.create({
          name: `${environments.foldername}/${name}`
        })
      })
    )
    expect(items).toHaveLength(FOLDER_NAMES.length)
  })

  test('Create one directory', async () => {
    const FOLDER_NAME: string = 'random'
    const data = await directoryService.create({
      name: `${environments.foldername}/${FOLDER_NAME}`
    })

    expect(data.name).toBe(FOLDER_NAME)
  })
})

describe('Getting directories', () => {
  test('Get many directories', async () => {
    const data = await directoryService.list() as Paginated<ResultEntity>
    expect(data.items.length).toBeGreaterThan(1)
  })

  test('Get 3 directories', async () => {
    const SIZE: number = 3
    const data = await directoryService.list({
      size: SIZE
    }) as Paginated<ResultEntity>
    expect(data.items).toHaveLength(SIZE)
  })
})

describe('Deleting directories', () => {
  test('Delete one directory', async () => {
    const path: string = `${environments.foldername}/random`
    const entity = await directoryService.remove(path)
    expect(entity.name).toBe('random')
  })

  test('Delete many directories', async () => {
    const data = await directoryService.list({
      path: environments.foldername
    }) as Paginated<ResultEntity>

    const paths: string[] = data.items.map(item => item.dir)
    const results = await Promise.all(
      paths.map(path => directoryService.remove(path))
    )

    expect(results).toHaveLength(data.items.length)
  })
})

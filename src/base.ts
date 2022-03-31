import { CloudinaryResults, FunctionBuilder } from './declarations'
import { Paginated, OutputEntity } from 'filesrocket'

export class BaseService {
  protected pagination<T> (
    data: CloudinaryResults<T>,
    func: FunctionBuilder<T>
  ): Paginated<Partial<OutputEntity>> {
    return {
      items: data.resources.map(func),
      nextPageToken: data.next_cursor,
      page: undefined,
      size: data.resources.length,
      total: data.total_count,
      prevPageToken: undefined
    }
  }
}

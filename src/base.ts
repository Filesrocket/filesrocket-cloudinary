import { CloudinaryResults, FunctionBuilder } from './declarations'
import { Paginated, OutputEntity } from 'filesrocket'
import { UploadApiResponse } from 'cloudinary'

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

  protected builder (payload: UploadApiResponse): OutputEntity {
    return {
      ...payload,
      id: payload.public_id,
      name: payload.filename || payload.public_id,
      size: payload.bytes,
      dir: payload.folder || '',
      ext: `.${payload.format}`,
      url: payload.secure_url,
      createdAt: new Date(payload.created_at),
      updatedAt: new Date(payload.updatedAt)
    }
  }
}

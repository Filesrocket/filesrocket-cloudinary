import { CloudinaryFileService, CloudinaryDirectoryService } from '../../src/index'
import { environments } from './environments'

export const fileService = new CloudinaryFileService(environments.cloudinary)
export const directoryService = new CloudinaryDirectoryService(environments.cloudinary)

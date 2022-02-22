import { DirectoryManager, FileManager } from '@filesrocket/filesrocket/lib'
import { CloudinaryOptions } from './index'

import { DirectoryService } from './services/directory.service'
import { FileService } from './services/file.service'

export class CloudinaryService implements FileManager, DirectoryManager {
  file: FileService;
  directory: DirectoryService;

  constructor (options: CloudinaryOptions) {
    this.file = new FileService(options)
    this.directory = new DirectoryService(options)
  }
}

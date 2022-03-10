import { CloudinaryService } from '../../src/index'
import { environments } from './environments'

const cloudinary = new CloudinaryService(environments.cloudinary)

export const fileService = cloudinary.directory

export const directoryService = cloudinary.directory

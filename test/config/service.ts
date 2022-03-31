import dotenv from 'dotenv'

import { CloudinaryFileService } from '../../src/index'

dotenv.config()

export default new CloudinaryFileService({
  pagination: { default: 15, max: 50 },
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

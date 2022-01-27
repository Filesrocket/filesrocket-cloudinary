# filesrocket-cloudinary
[Filesrocket](https://github.com/IvanZM123/filesrocket) service to manage your files and directories with [cloudinary](https://cloudinary.com/) services.

## Install
```
npm i filesrocket-cloudinary
```

## Usage
To use the service add the following content.

```ts
import {
  CloudinaryFileService,
  CloudinaryDirectoryService,
  CloudinaryOptions
} from "filesrocket-cloudinary";

const options: CloudinaryOptions = {
  pagination: { default: 15, max: 50 },
  cloud_name: "<Your CLOUD NAME>",
  api_key: "<Your API KEY>",
  api_secret: "<Your API SECRET>"
}

app.use(
  RocketRouter.forRoot({
    path: "storage",
    services: [
      // Manage your files.
      { service: new CloudinaryFileService(options) },
      // Manage your directories.
      { service: new CloudinaryDirectoryService(options) }
    ]
  })
);
```

For interact with the files and directories enter to the following enpoints.

**Files**: http://localhost:3030/storage/cloudinary/files

**Directories**: http://localhost:3030/storage/cloudinary/directories

> **Note**: To use this service, you need to have an account, enter [here](https://cloudinary.com/documentation/how_to_integrate_cloudinary) and follow the steps.

## Examples
We have also created many repositories with the most popular frameworks for you to play around with, to help as example guides.

| Framework | Repository |
| --------- | ---------- |
| Vue | [filesrocket-vue-app](https://github.com/IvanZM123/filesrocket-vue-app) |
| Angular | [filesrocket-angular-app](https://github.com/IvanZM123/filesrocket-angular-app) |
| React | [filesrocket-react-app](https://github.com/IvanZM123/filesrocket-react-app)|
| Express | [filesrocket-express-app](https://github.com/IvanZM123/filesrocket-express-app) |

# filesrocket-clodinary
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
We have created this repository to help as an example guide.

| Framework | Repository |
| --------- | ---------- |
| Express | [filesrocket-express-app](https://github.com/IvanZM123/filesrocket-express-app) |

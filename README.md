# filesrocket-clodinary
[Filesrocket](https://github.com/IvanZM123/filesrocket) service to manage your files and directories with [cloudinary](https://cloudinary.com/) services.

## Install
```
npm i filesrocket-cloudinary
```

## Usage
To use the service add the following content.

```ts
import { Filesrocket } from "filesrocket";
import { CloudinaryService } from "filesrocket-cloudinary";

// Initialize filesrocket
const filesrocket = new Filesrocket();

// Setting service
const cloudinary = new CloudinaryService({
  pagination: { default: 15, max: 50 },
  cloud_name: "<Your CLOUD NAME>",
  api_key: "<Your API KEY>",
  api_secret: "<Your API SECRET>"
});

// Register services
filesrocket.register("cloudinaryFile", cloudinary.file);

filesrocket.register("cloudinaryDirectory", cloudinary.directory);

// Recovering service
const fileService = filesrocket.service("cloudinaryFile");

const directoryService = filesrocket.service("cloudinaryDirectory");

// Recovering controller
const fileController = filesrocket.controller("cloudinaryFile");

const directoryController = filesrocket.controller("cloudinaryDirectory");
```

> **Note**: To use this service, you need to have an account, enter [here](https://cloudinary.com/documentation/how_to_integrate_cloudinary) and follow the steps.

# 📖 prisma-paginate

| [![npm version](https://badge.fury.io/js/prisma-paginate.svg)](https://badge.fury.io/js/prisma-paginate) | [![CI](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/ci.yaml/badge.svg)](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/ci.yaml) | [![pages-build-deployment](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/pages/pages-build-deployment) |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# Install

```shell
npm i prisma@>=4.9.0 @prisma/client@>=4.9.0 prisma-paginate@latest
yarn add prisma@>=4.9.0 @prisma/client@>=4.9.0 prisma-paginate@latest
```

⚠️ If you are using the **Prisma** version equal or greater than **>=4.9.0** use `clientExtensions` preview flag on schema file

**`prisma/schema.prisma`**:

```ts
generator client {
  provider      = "prisma-client-js"
  previewFeatures = ["clientExtensions"]
}
```

# Documentation and usage

For more details and type definitions see:

http://sandrewtx08.github.io/prisma-paginate/

## Importing

```js
// ESM
import { PrismaClient } from "@prisma/client";
import extension from "prisma-paginate";

// Commonjs
const { PrismaClient } = require("@prisma/client");
const { extension } = require("prisma-paginate");
```

## Applying extension

```js
const prisma = new PrismaClient();
const xprisma = prisma.$extends(extension);

xprisma.model2
  .paginate({ limit: 10, page: 1, select: { id: true } })
  .then((result) => {
    console.log(result);
  });

xprisma.table1
  .paginate({ select: { id: true } }, { limit: 10, page: 1 })
  .then((result) => {
    console.log(result);
  });
```

## Paginating 100 rows

```js
// on database = [ { id: 1 }, { id: 2 }, {...}, { id: 100 } ]
xprisma.model1
  .paginate(
    {
      where: {
        // query stuff...
      },
    },
    { page: 1, limit: 50 }
  )
  .then((result) => {
    console.log(result.result); // [ {...}, { id: 48 }, { id: 49 }, { id: 50 } ]
  });
```

## Parameters

- `findManyArgs` {Object}
- `paginationArgs` {Pagination}

---

- `findManyPaginationArgs` {Object&Pagination}

## Return

- `result` {Array}
- `totalPages` {Number} - Total of pages based on pagination arguments
- `hasNextPage` {Boolean} - If has result on next page index
- `hasPrevPage` {Boolean} - If has result on last page index
- `count` {Number} - Count how many rows on has on table/model with query filter
- `nextPage` {Promise} - Request next page
- `exceedCount` {Boolean}
- `exceedTotalPages` {Boolean}

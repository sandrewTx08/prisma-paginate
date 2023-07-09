# 📖 prisma-paginate

| [![npm version](https://badge.fury.io/js/prisma-paginate.svg)](https://badge.fury.io/js/prisma-paginate) | [![CI](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/ci.yaml/badge.svg)](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/ci.yaml) | [![pages-build-deployment](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/pages/pages-build-deployment) |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# Install

```shell
npm i prisma@>=4.9.0 @prisma/client@>=4.9.0 prisma-paginate@latest
yarn add prisma@>=4.9.0 @prisma/client@>=4.9.0 prisma-paginate@latest
```

⚠️ If you are using the **Prisma** version equal or greater than **>=4.9.0** add `clientExtensions` preview flag on schema file

**`prisma/schema.prisma`**:

```ts
generator client {
  provider      = "prisma-client-js"
  previewFeatures = ["clientExtensions"]
}
```

⚠️ These steps no longer required for versions starting from **4.16.0**

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
  .paginate({ where: { id: 5 } }, { limit: 10, page: 1 })
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

## Paginating SQL queries

```ts
const [{ count }] = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
  'SELECT COUNT(*) FROM "Model3";'
);

const pagination = new Pagination(limit, page, Number(count));
```

```ts
const data = await prisma.$queryRawUnsafe<unknown[]>(
  'SELECT name FROM "Model3" LIMIT $1 OFFSET $2;',
  limit,
  Pagination.offset(limit, page)
);
```

## Parameters

- `findManyArgs` {Object}
- `paginationArgs` {Pagination}

---

- `findManyPaginationArgs` {Object&Pagination}

## Return

- `result` {Array}
- `totalPages` {Number}
- `hasNextPage` {Boolean}
- `hasPrevPage` {Boolean}
- `count` {Number}
- `nextPage` {() => Promise}
- `exceedCount` {Boolean}
- `exceedTotalPages` {Boolean}

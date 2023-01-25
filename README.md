# 📖 prisma-paginate

| [![npm version](https://badge.fury.io/js/prisma-paginate.svg)](https://badge.fury.io/js/prisma-paginate) | [![Test](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/test.yaml/badge.svg)](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/test.yaml) | [![pages-build-deployment](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/pages/pages-build-deployment) |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# Install

`npm install prisma-paginate`

# Documentation and usage

For more details and type definitions see:

http://sandrewtx08.github.io/prisma-paginate/

## Importing

```js
// ESM
import { PrismaClient } from "@prisma/client";
import paginator from "prisma-paginate";

// Commonjs
const { PrismaClient } = require("@prisma/client");
const paginator = require("prisma-paginate");
```

## Creating a connection

```js
const prisma = new PrismaClient();
```

## Paginating 100 rows

```js
// on database = [ { id: 1 }, { id: 2 }, {...}, { id: 100 } ]
paginator(prisma.myTable)(
  {
    where: {
      // query stuff...
    },
  },
  { page: 1, limit: 50 }
).then((query) => {
  query.result; // return [ {...}, { id: 48 }, { id: 49 }, { id: 50 } ]
});
```

## Paginated client

You can easily create new **PrismaClient**:

```js
const paginate = paginateClient();

paginate.myTable.paginate({ where: {} }, { limit: 10, page: 1 });
paginate.myOtherTable.paginate({ where: {} }, { limit: 20, page: 1 });
```

Or reuse one:

```js
const prisma = new PrismaClient();
const paginate = paginateClient(prisma);

paginate.myTable.paginate({ where: {} }, { limit: 10, page: 1 });
paginate.myOtherTable.paginate({ where: {} }, { limit: 20, page: 1 });
```

## Parameters

- `findManyArgs` {Object} - Query with findMany Prisma arguments
- `paginationOrCallback?` {Object|(err, result)} - Pagination arguments or callback
  - `page` {Number}
  - `pageIndex` {Number}
  - `limit` {Number}
  - `exceedCount` {Boolean}
- `callback?` {(err, result)}

## Return

- `result` {Array} - Pagination result
- `totalPages` {Number} - Total of pages based on pagination arguments
- `hasNextPage` {Boolean} - If has result on next page index
- `hasPrevPage` {Boolean} - If has result on last page index
- `count` {Number} - Count how many rows on has on table/model with query filter

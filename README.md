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

## Paginated client

### Reusing exist client

```js
const prisma = new PrismaClient();
const paginate = paginator(prisma);

paginate.myTable.paginate({ limit: 20, page: 1, where: {} }, (err, result) => {
  console.log(err, result);
});
paginate.myOtherTable
  .paginate({ where: {} }, { limit: 10, page: 1 })
  .then((result) => {
    console.log(result);
  });
```

## Paginating 100 rows

```js
// on database = [ { id: 1 }, { id: 2 }, {...}, { id: 100 } ]
paginate.myTable
  .paginate(
    {
      where: {
        // query stuff...
      },
    },
    { page: 1, limit: 50 }
  )
  .then((result) => {
    console.log(result); // [ {...}, { id: 48 }, { id: 49 }, { id: 50 } ]
  });
```

### Other Prisma methods is avalible too

```js
const prisma = new PrismaClient();
const paginate = paginator(prisma);

paginate.myTable.findMany({ where: { field: true } });
paginate.myTable.findOne({ where: { id: 1 } });
paginate.myOtherTable.count();

// Or

const myTable = paginator(prisma.myTable);
const myOtherTable = paginator(prisma.myOtherTable);

myTable.findMany({ where: { field: true } });
myTable.findOne({ where: { id: 1 } });
myOtherTable.count();
```

### Passing model name

```js
paginator("myTable").paginate({
  where: { from_id: 2 },
  pageIndex: 0,
  limit: 30,
});
```

### Creating new client

```js
const paginate = paginator();

paginate.myTable.paginate({ where: {} }, { limit: 10, page: 1 });
paginate.myOtherTable.paginate({ where: {}, limit: 10, page: 2 });
```

## Parameters

- `findManyPaginationArgs` {Object} - Query with findMany Prisma and pagination arguments
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
- `nextPage` {(err, result)} - Request next page

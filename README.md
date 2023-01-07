# prisma-paginate

[![Node.js CI](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/nodejs.yaml/badge.svg?branch=master)](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/nodejs.yaml)

[![pages-build-deployment](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/pages/pages-build-deployment)

# Install

`npm install prisma-paginate`

# Documentation and usage

For more details and type definitions see:

http://sandrewtx08.github.io/prisma-paginate/

## Example

```js
// ESM
import { PrismaClient } from "@prisma/client";
import prismaPaginate from "prisma-paginate";

// Commonjs
const { PrismaClient } = require("@prisma/client");
const prismaPaginate = require("prisma-paginate").paginate;

const client = new PrismaClient();

// on database = [ { id: 1 }, { id: 2 }, ...{ id: 100 } ]
prismaPaginate(client.table)(
  {
    where: {
      // query stuff...
    },
  },
  { page: 1, limit: 50 }
).then((query) => {
  query.result; // return [ ...{ id: 48 }, { id: 49 }, { id: 50 } ]
});
```

## Parameters

- `findManyArgs` {Object} - Query with findMany Prisma arguments
- `paginationOrCallback?` {Object|(err, result)} - Pagination arguments or callback
  - `page` {Number}
  - `pageIndex` {Number}
  - `limit` {Number}
- `callback?` {(err, result)}

## Return

- `totalPages` {Number} - Total of pages based on pages parameters and limit;
- `hasNextPage` {Boolean} - Has result on next page index;
- `hasPrevPage` {Boolean} - Has result on last page index;
- `count` {Number} - Count how many rows on has on table/model with query filter;

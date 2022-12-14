# prisma-paginate

<div style="display: flex; gap: 1em;">
<p><a href="https://github.com/sandrewTx08/prisma-paginate/actions/workflows/test.yaml"><img src="https://github.com/sandrewTx08/prisma-paginate/actions/workflows/test.yaml/badge.svg" alt="Test"></a></p>

<p><a href="https://github.com/sandrewTx08/prisma-paginate/actions/workflows/pages/pages-build-deployment"><img src="https://github.com/sandrewTx08/prisma-paginate/actions/workflows/pages/pages-build-deployment/badge.svg" alt="pages-build-deployment"></a></p>

<p><a href="https://badge.fury.io/js/prisma-paginate"><img src="https://badge.fury.io/js/prisma-paginate.svg" alt="npm version"></a></p>
</div>

# Install

`npm install prisma-paginate`

# Documentation and usage

For more details and type definitions see:

http://sandrewtx08.github.io/prisma-paginate/

## Examples

```js
// ESM
import { PrismaClient } from "@prisma/client";
import prismaPaginate from "prisma-paginate";

// Commonjs
const { PrismaClient } = require("@prisma/client");
const paginate = require("prisma-paginate");

const client = new PrismaClient();

// on database = [ { id: 1 }, { id: 2 }, ...{ id: 100 } ]
paginate(client.table)(
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

- `totalPages` {Number} - Total of pages based on pagination arguments
- `hasNextPage` {Boolean} - If has result on next page index
- `hasPrevPage` {Boolean} - If has result on last page index
- `count` {Number} - Count how many rows on has on table/model with query filter

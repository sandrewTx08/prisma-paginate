# prisma-paginate

# Install

`npm install prisma-paginate`

# Documentation and usage

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
// On database = [{ id: 1 },{ id: 2 }]
const myTable = prismaPaginate(client.model);

myTable(
  {
    where: {
      // query stuff...
    },
  },
  { page: 1, limit: 1 }
).then((query) => {
  query.result; // Return [{ id: 1 }]
});
```

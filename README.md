# 📖 prisma-paginate

| [![npm version](https://badge.fury.io/js/prisma-paginate.svg)](https://badge.fury.io/js/prisma-paginate) | [![CI](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/ci.yaml/badge.svg)](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/ci.yaml) | [![pages-build-deployment](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/pages/pages-build-deployment) |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## 🚀 Installation

```bash
# Using npm
npm install prisma @prisma/client prisma-paginate

# Using yarn
yarn add prisma @prisma/client prisma-paginate

# Using pnpm
pnpm add prisma @prisma/client prisma-paginate
```

## 📚 Documentation

For comprehensive API documentation and type definitions, visit:

**[http://sandrewtx08.github.io/prisma-paginate/](http://sandrewtx08.github.io/prisma-paginate/)**

## 📦 Importing

### ESM (ES Modules)

```typescript
// Standard Prisma client
import { PrismaClient } from "@prisma/client";
import PrismaPaginate from "prisma-paginate";

// Custom Prisma client paths also work
import { PrismaClient } from "./generated/client";
import PrismaPaginate from "prisma-paginate";
```

### CommonJS

```javascript
const { PrismaClient } = require("@prisma/client");
const PrismaPaginate = require("prisma-paginate").default;
```

> **Note:** The extension works seamlessly with any Prisma client instance, regardless of the import path. No additional configuration needed!

## 🔧 Usage

### Basic Setup

```typescript
const prisma = new PrismaClient();
const xprisma = prisma.$extends(PrismaPaginate);

// Simple pagination with page and limit
xprisma.user
	.paginate({ limit: 10, page: 1, select: { id: true, name: true } })
	.then((result) => {
		console.log(result);
	});

// Pagination with filters
xprisma.post
	.paginate({ where: { published: true } }, { limit: 10, page: 1 })
	.then((result) => {
		console.log(result);
	});
```

### Complete Example

```typescript
// Assume database has 100 rows: [ { id: 1 }, { id: 2 }, ..., { id: 100 } ]
xprisma.user
	.paginate(
		{
			where: {
				active: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		},
		{ page: 1, limit: 50 },
	)
	.then((result) => {
		console.log(result.result); // Array of 50 users
		console.log(result.totalPages); // Total number of pages
		console.log(result.hasNextPage); // true if there's a next page
		console.log(result.hasPrevPage); // true if there's a previous page
		console.log(result.count); // Total count of records
	});
```

### Raw SQL Queries

For complex queries using raw SQL, you can still leverage the pagination utilities:

```typescript
// Get the total count
const [{ count }] = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
	'SELECT COUNT(*) FROM "User";',
);

// Create pagination instance
const pagination = new Pagination(limit, page, Number(count));

// Execute paginated query
const data = await prisma.$queryRawUnsafe<unknown[]>(
	'SELECT name FROM "User" LIMIT $1 OFFSET $2;',
	limit,
	Pagination.offset(limit, page),
);
```

## 📋 API Reference

### Method Signatures

```typescript
// Option 1: Combined findMany args and pagination
paginate(findManyPaginationArgs: PrismaFindManyArgs & PaginationArgs)

// Option 2: Separate findMany args and pagination
paginate(findManyArgs: PrismaFindManyArgs, paginationArgs: PaginationArgs)
```

### Parameters

#### `findManyArgs` (Object)

Standard Prisma `findMany` arguments including:

- `where` - Filter conditions
- `select` - Fields to select
- `include` - Relations to include
- `orderBy` - Sorting options
- And all other Prisma query options

#### `paginationArgs` (Object)

Pagination configuration:

- `page` (Number) - Page number (starts from 1)
- `limit` (Number) - Number of items per page
- `onCount?` (Function) - Optional callback: `(pagination: Pagination) => void`

### Return Value

The `paginate()` method returns a `Promise<PaginationResult>` with the following properties:

| Property           | Type     | Description                                    |
| ------------------ | -------- | ---------------------------------------------- |
| `result`           | Array    | Array of paginated records                     |
| `totalPages`       | Number   | Total number of pages available                |
| `hasNextPage`      | Boolean  | Whether a next page exists                     |
| `hasPrevPage`      | Boolean  | Whether a previous page exists                 |
| `count`            | Number   | Total count of all records matching the query  |
| `nextPage`         | Function | Returns `Promise` to fetch the next page       |
| `exceedCount`      | Boolean  | Whether the query exceeded the maximum count   |
| `exceedTotalPages` | Boolean  | Whether the requested page exceeds total pages |

## ✨ Features

- 🚀 **Easy Integration** - Simple Prisma extension setup
- 📦 **TypeScript Support** - Full type safety with IntelliSense
- 🔄 **Flexible API** - Multiple ways to call pagination
- 📊 **Complete Metadata** - Get total pages, counts, and navigation info
- 🎯 **Prisma Native** - Works with all Prisma query options
- 🛠️ **Raw SQL Support** - Utilities for custom SQL queries
- ⚡ **Zero Config** - Works out of the box with any Prisma setup

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [Documentation](http://sandrewtx08.github.io/prisma-paginate/)
- [GitHub Repository](https://github.com/sandrewTx08/prisma-paginate)
- [npm Package](https://www.npmjs.com/package/prisma-paginate)
- [Report Issues](https://github.com/sandrewTx08/prisma-paginate/issues)
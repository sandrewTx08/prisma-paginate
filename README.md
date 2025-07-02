
<div align="right">
  <details>
    <summary >🌐 Language</summary>
    <div>
      <div align="right">
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=en">English</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=zh-CN">简体中文</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=zh-TW">繁體中文</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=ja">日本語</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=ko">한국어</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=hi">हिन्दी</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=th">ไทย</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=fr">Français</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=de">Deutsch</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=es">Español</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=it">Itapano</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=ru">Русский</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=pt">Português</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=nl">Nederlands</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=pl">Polski</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=ar">العربية</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=fa">فارسی</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=tr">Türkçe</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=vi">Tiếng Việt</a></p>
        <p><a href="https://openaitx.github.io/view.html?user=sandrewTx08&project=prisma-paginate&lang=id">Bahasa Indonesia</a></p>
      </div>
    </div>
  </details>
</div>

# 📖 prisma-paginate

| [![npm version](https://badge.fury.io/js/prisma-paginate.svg)](https://badge.fury.io/js/prisma-paginate) | [![CI](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/ci.yaml/badge.svg)](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/ci.yaml) | [![pages-build-deployment](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/sandrewTx08/prisma-paginate/actions/workflows/pages/pages-build-deployment) |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

# Install

```shell
npm i prisma @prisma/client prisma-paginate@latest
yarn add prisma @prisma/client prisma-paginate@latest
```

# Documentation and usage

For more details and type definitions see:

http://sandrewtx08.github.io/prisma-paginate/

## Importing

```js
// ESM
import { PrismaClient } from "@prisma/client";
import { extension } from "prisma-paginate";

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
		{ page: 1, limit: 50 },
	)
	.then((result) => {
		console.log(result.result); // [ {...}, { id: 48 }, { id: 49 }, { id: 50 } ]
	});
```

## Paginating SQL queries

```ts
const [{ count }] = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
	'SELECT COUNT(*) FROM "Model3";',
);

const pagination = new Pagination(limit, page, Number(count));
```

```ts
const data = await prisma.$queryRawUnsafe<unknown[]>(
	'SELECT name FROM "Model3" LIMIT $1 OFFSET $2;',
	limit,
	Pagination.offset(limit, page),
);
```

## Parameters

- `findManyArgs` {Object}
- `paginationArgs` {Pagination&onCount?(pagination) => void}

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

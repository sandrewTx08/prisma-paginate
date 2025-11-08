import prisma from "./prisma";

async function main() {
	const result = await prisma.user.paginate({
		where: { name: { contains: "Alice" } },
		limit: 10,
		page: 1,
	});

	console.log(result);
}

main();

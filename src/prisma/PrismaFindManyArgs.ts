import { Prisma } from "@prisma/client/extension";

export type PrismaFindManyArgs<Model, Args> = Prisma.Exact<
	Args,
	Omit<Prisma.Args<Model, "findMany">, "skip" | "take">
>;

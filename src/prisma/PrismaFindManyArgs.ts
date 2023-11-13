import { Prisma } from "@prisma/client";

export type PrismaFindManyArgs<Model, Args> = Prisma.Exact<
	Args,
	Omit<Prisma.Args<Model, "findMany">, "skip" | "take">
>;

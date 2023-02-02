import { PrismaClient } from "@prisma/client";

export interface PrismaModel {
  findMany(args: any): Promise<any>;
  count(args: any): Promise<number>;
}

export type PrismaFindManyReturn<Model extends PrismaModel> = Awaited<
  ReturnType<Model["findMany"]>
>;

export type PrismaFindManyArgs<Model extends PrismaModel> = Omit<
  NonNullable<Parameters<Model["findMany"]>[0]>,
  "skip" | "take"
>;

export type PrismaClientModels = Omit<
  typeof PrismaClient.prototype,
  | "$executeRaw"
  | "$disconnect"
  | "$on"
  | "$connect"
  | "$executeRawUnsafe"
  | "$queryRaw"
  | "$queryRawUnsafe"
  | "$use"
  | "$transaction"
>;

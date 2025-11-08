import { PrismaClient } from "./generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import PrismaPaginate from "prisma-paginate";

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter, log: ["info"] });

export default prisma.$extends(PrismaPaginate);

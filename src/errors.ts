import { PaginationOptions } from "./prismaPaginate";

export class PaginationExceed extends Error {
  constructor(public options: PaginationOptions) {
    super("Pagination exceed the total of rows");
  }
}

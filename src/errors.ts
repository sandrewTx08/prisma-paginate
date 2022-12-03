import { PaginationArgs } from "./model";

export class PaginationExceed extends Error {
  constructor(public options: PaginationArgs) {
    super("Pagination exceed the total of rows");
  }
}

import { PaginationOptions } from "./model";

export class PaginationExceed extends Error {
  constructor(public options: PaginationOptions) {
    super("Pagination exceed the total of rows");
  }
}

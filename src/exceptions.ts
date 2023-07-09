import type { IPagination } from "./pagination";

export abstract class PaginationException extends Error {
  readonly pagination?: IPagination;
}

export class ExceedCount extends PaginationException {
  constructor(readonly pagination: IPagination) {
    super("Pagination exceed count of rows");
  }
}

export class ExceedTotalPages extends PaginationException {
  constructor(readonly pagination: IPagination) {
    super("Pagination exceed total of pages");
  }
}

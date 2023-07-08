import type { IPagination } from "./pagination";

export abstract class PaginationException extends Error {
  public readonly pagination?: IPagination;
}

export class ExceedCount extends PaginationException {
  public constructor(public readonly pagination: IPagination) {
    super("Pagination exceed count of rows");
  }
}

export class ExceedTotalPages extends PaginationException {
  public constructor(public readonly pagination: IPagination) {
    super("Pagination exceed total of pages");
  }
}

import { Pagination } from "./types";

export class ExceedCount extends Error {
  constructor(public pagination: Pagination.Value) {
    super("Pagination options exceed count of rows");
  }
}

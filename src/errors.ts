import { Pagination } from "./types";

export class TotalPagesExceed extends Error {
  constructor(public pagination: Pagination.Value) {
    super("Pagination options exceed total pages");
  }
}

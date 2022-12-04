import { Pagination } from "./types";

class ErrorTotalPages extends Error {
  constructor(public pagination: Pagination.Result) {
    super("Pagination options exceed total pages");
  }
}

export { ErrorTotalPages };

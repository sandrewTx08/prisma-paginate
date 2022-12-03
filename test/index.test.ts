import { prismaPaginate } from "../src";
import { data, model } from "./utils";

describe("return value", () => {
  const [id_1] = data;

  describe("callback", () => {
    it("withoutPagination", () => {
      prismaPaginate(model, { where: { id: 1 } }, (error, result) => {
        expect(error).toBe(null);
        expect(result?.result).toBe(id_1);
      });
    });

    it("withPagination", () => {
      prismaPaginate(
        model,
        { where: { id: 1 } },
        { page: 1, limit: 1 },
        (error, result) => {
          expect(error).toBe(null);
          expect(result?.result).toBe(id_1);
          expect(result?.count).toBe(data.length);
        }
      );
    });
  });

  describe("promise", () => {
    it("withoutPagination", () => {
      prismaPaginate(model, { where: { id: 1 } }).then((result) => {
        expect(result?.result).toBe(id_1);
      });
    });

    it("withoutPagination", () => {
      prismaPaginate(model, { where: { id: 1 } }, { page: 1, limit: 1 }).then(
        (result) => {
          expect(result?.result).toBe(id_1);
          expect(result?.count).toBe(data.length);
        }
      );
    });
  });
});

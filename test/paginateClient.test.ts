import { PrismaClient } from "@prisma/client";
import paginator from "../src";
import { client } from "./utils";

describe("paginateClient", () => {
  const paginate = paginator(client);

  it("paginate spp cb", () => {
    paginate.model.paginate({}, { page: 1, limit: 10 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeTruthy();
    });
  });

  it("paginate spp pm", () => {
    paginate.model.paginate({}, { page: 1, limit: 10 }).then((result) => {
      expect(result?.result).toBeTruthy();
    });
  });

  it("paginate aip cb", () => {
    paginate.model.paginate({ page: 1, limit: 10 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeTruthy();
    });
  });

  it("paginate aip pm", () => {
    paginate.model.paginate({ page: 1, limit: 10 }).then((result) => {
      expect(result?.result).toBeTruthy();
    });
  });

  it("paginate scp cb", () => {
    paginator("model").paginate({ page: 1, limit: 10 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeTruthy();
    });
  });

  it("paginate scp pm", () => {
    paginator("model")
      .paginate({ page: 1, limit: 10 })
      .then((result) => {
        expect(result?.result).toBeTruthy();
      });
  });

  it("paginate cpp cb", () => {
    paginator(new PrismaClient()).model.paginate(
      { page: 1, limit: 10 },
      (error, result) => {
        expect(error).toBe(null);
        expect(result?.result).toBeTruthy();
      }
    );
  });

  it("paginate cpp pm", () => {
    paginator(new PrismaClient())
      .model.paginate({ page: 1, limit: 10 })
      .then((result) => {
        expect(result?.result).toBeTruthy();
      });
  });

  it("paginate mcp cb", () => {
    paginator(new PrismaClient().model).paginate(
      { page: 1, limit: 10 },
      (error, result) => {
        expect(error).toBe(null);
        expect(result?.result).toBeTruthy();
      }
    );
  });

  it("paginate mcp pm", () => {
    paginator(new PrismaClient().model)
      .paginate({ page: 1, limit: 10 })
      .then((result) => {
        expect(result?.result).toBeTruthy();
      });
  });

  it("model methods", () => {
    expect(paginate.model.findMany).toBeInstanceOf(Function);
    expect(paginate.model.findUnique).toBeInstanceOf(Function);
    expect(paginate.model.findFirst).toBeInstanceOf(Function);
    expect(paginate.model.count).toBeInstanceOf(Function);
  });

  it("client methods", () => {
    expect(paginate.$use).toBeInstanceOf(Function);
    expect(paginate.$on).toBeInstanceOf(Function);
    expect(paginate.$transaction).toBeInstanceOf(Function);
  });
});

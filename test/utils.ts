const mockResult = new Array<{ id: number }>(3);
const mockModel = {
  findMany: async (..._: any[]) => mockResult,
  count: async (..._: any[]) => mockResult.length,
};

export { mockResult, mockModel };

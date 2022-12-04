const mockDatabase = new Array<{ id: number }>(3);
const mockModel = {
  findMany: async (..._: any[]) => mockDatabase,
  count: async (..._: any[]) => mockDatabase.length,
};

export { mockDatabase, mockModel };

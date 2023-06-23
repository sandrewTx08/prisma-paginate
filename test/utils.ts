export const randomArray = createRandomArray();

export const randomIds = randomArray.map((id) => ({ id }));

export function createRandomArray() {
  return Array.from({ length: 100 }, (_, i) => i);
}

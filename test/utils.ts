export function createRandomArray() {
  return [
    ...new Set(
      Array.from({ length: 100 }, () =>
        Number((Math.random() * 100).toFixed(0))
      )
    ),
  ].sort((asc, desc) => asc - desc);
}

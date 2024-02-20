export function numberToChips(number: number): string[] {
  const result: number[] = [];
  const decimals = [50, 25, 10, 5, 1];

  decimals.map((value) => {
    while (number >= value) {
      result.push(value);
      number -= value;
    }
  });

  return result
    .sort((a, b) => a - b)
    .reverse()
    .map((v) => `C_${v}`);
}

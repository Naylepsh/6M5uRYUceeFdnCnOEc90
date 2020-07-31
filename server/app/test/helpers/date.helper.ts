export function expectDatesToBeTheSame(
  dateString1: string,
  dateString2: string,
): void {
  function foo(date: string): number[] {
    return date.split('-').map(x => +x);
  }
  expect(foo(dateString1)).toStrictEqual(foo(dateString2));
}

export function expectDatetimesToBeTheSame(
  dateString1: string,
  dateString2: string,
): void {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  expect(date1).toStrictEqual(date2);
}

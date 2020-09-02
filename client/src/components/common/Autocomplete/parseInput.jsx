export function parseInput(event) {
  const valuesString = event.currentTarget.value;
  const values = valuesString
    .split(",")
    .filter((value) => !!value)
    .map((value) => value.trim());
  const [lastValue] = values.slice(-1);

  return lastValue;
}

export function getLastValueFromInput(value) {
  const valuesString = value;
  const values = valuesString
    .split(",")
    .filter((value) => !!value)
    .map((value) => value.trim());
  const [lastValue] = values.slice(-1);

  return lastValue;
}

export function setLastValueInInput(value, newValue) {
  const valuesString = value;
  console.log(valuesString);
  const values = valuesString
    .split(",")
    .filter((value) => !!value)
    .map((value) => value.trim());
  const lastIndex = values.length - 1;
  values[lastIndex] = newValue.trim();
  const newValuesString = values.join(",");

  return newValuesString;
}

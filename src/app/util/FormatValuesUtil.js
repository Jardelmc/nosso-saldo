export default function formatValue(value) {
  if (value === 0) {
    return `${value},00`;
  }
  if (value) {
    value = String(value);
    value = value.replace('.', ',');
    const splittedValue = value.split(',');

    if (splittedValue.length > 1) {
      const valueReturn =
        splittedValue[1].length === 2
          ? `${splittedValue[0]},${splittedValue[1]}`
          : `${splittedValue[0]},${splittedValue[1]}0`;

      return valueReturn;
    }
    return `${value},00`;
  }

  return false;
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function splitByCapital(string: string) {
  return string.split(/(?=[A-Z])/).join(" ");
}

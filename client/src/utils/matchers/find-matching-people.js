export function findMatchingPeople(people, string) {
  const regex = new RegExp(string, "gi");
  return people.filter(
    ({ id, firstName, lastName }) =>
      id.match(regex) || firstName.match(regex) || lastName.match(regex)
  );
}

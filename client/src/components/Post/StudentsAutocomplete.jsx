import React, { useState, useEffect } from "react";
import { StudentsService } from "../../services/students-service";
import Autocomplete from "../common/Autocomplete";
import { parseInput } from "../../utils/parseInput";

export const StudentsAutocomplete = React.forwardRef((props, ref) => {
  const [students] = useStudents();
  return (
    <Autocomplete
      {...props}
      ref={ref}
      suggestions={students}
      findMatchingSuggestions={findMatchingStudents}
      parseInput={parseInput}
    />
  );
});

function useStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const studentsService = new StudentsService();
    async function fetchStudents() {
      const { data } = await studentsService.getAll();
      setStudents(data);
    }

    fetchStudents();
  }, []);

  return [students];
}

function findMatchingStudents(students, string) {
  const regex = new RegExp(string, "gi");
  return students.filter(
    ({ id, firstName, lastName }) =>
      id.match(regex) || firstName.match(regex) || lastName.match(regex)
  );
}

import React, { useState, useEffect } from "react";
import { StudentsService } from "../../services/students-service";
import Autocomplete from "../common/Autocomplete";
import { findMatchingPeople } from "../../utils/matchers/find-matching-people";

export const StudentsAutocomplete = React.forwardRef((props, ref) => {
  const [students] = useStudents();

  return (
    <Autocomplete
      {...props}
      ref={ref}
      suggestions={students}
      findMatchingSuggestions={findMatchingPeople}
      renderSuggestion={renderStudentSuggestion}
      acceptSuggestion={acceptStudentSuggestion}
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

function renderStudentSuggestion(student) {
  return `${student.id}, ${student.firstName}, ${student.lastName}`;
}

function acceptStudentSuggestion(student) {
  return student.id;
}

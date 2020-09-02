import React, { useState, useEffect } from "react";
import { getLastValueFromInput } from "../../utils/parseInput";
import { LecturersService } from "./../../services/lecturers-service";
import Autocomplete from "../common/Autocomplete";
import { findMatchingPeople } from "../../utils/matchers/find-matching-people";

export const LecturersAutocomplete = React.forwardRef((props, ref) => {
  const [lecturers] = useLecturers();
  return (
    <Autocomplete
      {...props}
      ref={ref}
      suggestions={lecturers}
      findMatchingSuggestions={findMatchingPeople}
      parseInput={getLastValueFromInput}
      renderSuggestion={renderLecturerSuggestion}
    />
  );
});

function useLecturers() {
  const [lecturers, setLecturers] = useState([]);

  useEffect(() => {
    const lecturersService = new LecturersService();
    async function fetchLecturers() {
      const { data } = await lecturersService.getAll();
      setLecturers(data);
    }

    fetchLecturers();
  }, []);

  return [lecturers];
}

function renderLecturerSuggestion(lecturer) {
  return `${lecturer.id}, ${lecturer.firstName}, ${lecturer.lastName}`;
}

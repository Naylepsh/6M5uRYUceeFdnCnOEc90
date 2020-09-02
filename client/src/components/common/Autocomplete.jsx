import React from "react";
import { useState } from "react";

export const Autocomplete = React.forwardRef((props, ref) => {
  const {
    suggestions = [],
    findMatchingSuggestions,
    parseInput,
    onChange,
    ...inputProps
  } = props;
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const onInputChange = (event) => {
    const value = parseInput(event);
    const filteredSuggestions = findMatchingSuggestions(suggestions, value);
    setFilteredSuggestions(filteredSuggestions);
    onChange(event);
  };

  console.log(filteredSuggestions);

  return (
    <React.Fragment>
      <input ref={ref} {...inputProps} onChange={onInputChange} />
      <ul></ul>
    </React.Fragment>
  );
});
export default Autocomplete;

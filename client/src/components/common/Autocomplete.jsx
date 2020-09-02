import React from "react";
import { useState } from "react";

export const Autocomplete = React.forwardRef((props, ref) => {
  const {
    suggestions = [],
    findMatchingSuggestions,
    parseInput,
    onChange,
    renderSuggestion,
    ...inputProps
  } = props;
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const onInputChange = (event) => {
    const value = parseInput(event);
    const filteredSuggestions = findMatchingSuggestions(suggestions, value);
    setFilteredSuggestions(filteredSuggestions);
    onChange(event);
  };

  return (
    <React.Fragment>
      <input ref={ref} {...inputProps} onChange={onInputChange} />
      <ul>
        {filteredSuggestions.map((suggestion) => (
          <li>{renderSuggestion(suggestion)}</li>
        ))}
      </ul>
    </React.Fragment>
  );
});
export default Autocomplete;

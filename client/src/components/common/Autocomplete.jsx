import React, { useState } from "react";
import {
  getLastValueFromInput,
  setLastValueInInput,
} from "../../utils/parseInput";

export const Autocomplete = React.forwardRef((props, ref) => {
  const {
    suggestions = [],
    findMatchingSuggestions,
    onChange,
    renderSuggestion,
    acceptSuggestion,
    ...inputProps
  } = props;
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const onInputChange = (event) => {
    const value = getLastValueFromInput(event.currentTarget.value);
    const filteredSuggestions = findMatchingSuggestions(suggestions, value);
    setFilteredSuggestions(filteredSuggestions);
    onChange(event);
  };

  const onSuggestionClick = (suggestion) => {
    const value = acceptSuggestion(suggestion);
    const valueString = setLastValueInInput(ref.current.value, value);
    ref.current.value = valueString;
  };

  return (
    <React.Fragment>
      <input ref={ref} {...inputProps} onChange={onInputChange} />
      <ul>
        {filteredSuggestions.map((suggestion) => (
          <li key={suggestion.id} onClick={() => onSuggestionClick(suggestion)}>
            {renderSuggestion(suggestion)}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
});
export default Autocomplete;

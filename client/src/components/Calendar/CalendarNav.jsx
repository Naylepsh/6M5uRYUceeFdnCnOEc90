import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./CalendarNav.css";

//Provides buttons for swiping calendar up/down
export function CalendarNav({ onEarlier, onLater, showLater }) {
  return (
    <div className="Calendar_nav">
      <button className="Calendar_earlier icon_button" onClick={onEarlier}>
        <FaChevronUp /> <span>Wcześniej</span>
      </button>
      {showLater && (
        <button className="Calendar_later icon_button" onClick={onLater}>
          <FaChevronDown /> <span>Później</span>
        </button>
      )}
    </div>
  );
}

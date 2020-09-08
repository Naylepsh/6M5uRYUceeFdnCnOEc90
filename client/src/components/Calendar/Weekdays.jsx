import React, { useState } from "react";
import "./Weekdays.css";

const weekdays = ["pon", "wt", "śr", "czw", "pt", "sb", "nd"];

export function Weekdays() {
  return (
    <div className="Weekdays">
      {weekdays.map((day, i) => (
        <div key={i}>{day}</div>
      ))}
    </div>
  );
}

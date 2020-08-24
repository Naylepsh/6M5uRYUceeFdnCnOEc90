import React from "react";
import "./Weekdays.css";
//Simpy static elements with polish day names

export function Weekdays() {
  return (
    <div className="Weekdays">
      <div>niedziela</div>
      <div>poniedziałek</div>
      <div>wtorek</div>
      <div>środa</div>
      <div>czwartek</div>
      <div>piątek</div>
      <div>sobota</div>
    </div>
  );
}

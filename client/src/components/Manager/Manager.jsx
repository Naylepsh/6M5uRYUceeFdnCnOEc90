import React from "react";
import "./Manager.css";

export default function Manager() {
  return (
    <div className="Manager">
      <div className="Manager_title_form">Dodaj grupę: </div>
      <form className="Manager_form">
        <label htmlFor="group_day">
          Dzień:{" "}
          <input
            className="Manager_fields"
            type="text"
            id="group_day"
            name="group_day"
          />
        </label>

        <label htmlFor="group_hour">
          {" "}
          Godzina:{" "}
          <input
            className="Manager_fields"
            type="time"
            id="group_hour"
            name="group_hour"
          />
        </label>

        <label htmlFor="group_place">
          {" "}
          Lokalizacja:{" "}
          <select
            className="Manager_fields"
            name="group_place"
            id="group_place"
          >
            <option value="Pl. Solidarności - Zielona">
              Pl. Solidarności - Zielona
            </option>
            <option value="Pl. Solidarności - Niebieska">
              Pl. Solidarności - Niebieska
            </option>
            <option value="Pl. Solidarności - Żółta">
              Pl. Solidarności - Żółta
            </option>
            <option value="Zdalnie">Zdalnie</option>
          </select>
        </label>

        <label htmlFor="group_start_date">
          {" "}
          Data rozpoczęcia:{" "}
          <input
            className="Manager_fields"
            type="date"
            id="group_start_date"
            name="group_start_date"
          />
        </label>

        <label htmlFor="group_end_date">
          {" "}
          Data zakończenia:{" "}
          <input
            className="Manager_fields"
            type="date"
            id="group_end_date"
            name="group_end_date"
          />
        </label>

        <br />

        <label htmlFor="group_lecturers">
          {" "}
          Prowadzący:{" "}
          <input
            className="Manager_fields"
            type="text"
            id="group_lecturers"
            name="group_lecturers"
          />
        </label>

        <label htmlFor="group_students">
          {" "}
          Uczniowie:{" "}
          <input
            className="Manager_fields"
            type="text"
            id="group_students"
            name="group_students"
          />
        </label>
      </form>
    </div>
  );
}

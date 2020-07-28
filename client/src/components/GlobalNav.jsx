import React from "react";
import { Link } from "./../utils/react-router-next";
import { FaCalendarAlt, FaHotjar } from "react-icons/fa";
import "./GlobalNav.css";

export default function GlobalNav() {
  return (
    <nav className="GlobalNav">
      <Link href="/">
        <FaCalendarAlt /> <span>Kalendarz</span>
      </Link>
      <Link href="/feed">
        <FaHotjar /> <span>Ostatnie notatki</span>
      </Link>
    </nav>
  );
}

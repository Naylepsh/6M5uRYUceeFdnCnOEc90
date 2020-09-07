import React from "react";
import { Link } from "./../utils/react-router-next";
import { FaCalendarAlt, FaBell, FaUserEdit } from "react-icons/fa";
import "./GlobalNav.css";

export default function GlobalNav() {
  return (
    <nav className="GlobalNav">
      <Link href="/">
        <FaCalendarAlt /> <span>Kalendarz</span>
      </Link>
      <Link href="/manager">
        <FaUserEdit /> <span>Edytuj dane</span>
      </Link>
      <Link href="/feed">
        <FaBell /> <span>Ostatnie notatki</span>
      </Link>
    </nav>
  );
}

import React from "react";
import { logout } from "./../tools";
import { useAppState } from "./../states/AppState";
import Avatar from "./Avatar";
import { FaPowerOff } from "react-icons/fa";
import GlobalNav from "./GlobalNav";
import "./TopBar.css";

export default function TopBar({ children }) {
  return (
    <div className="TopBar">
      <div className="TopBar_inner">
        <GlobalNav />
        <Account />
      </div>
    </div>
  );
}

function Account() {
  const [{ user }] = useAppState();

  return user ? (
    <div className="Account">
      <Avatar uid={user.uid} />
      <div className="Account_user_name">{user.displayName}</div>
      <button
        aria-label="Log out"
        title="Log out"
        className="Account_logout icon_button"
        onClick={logout}
      >
        <FaPowerOff />
      </button>
    </div>
  ) : (
    <div>Wczytywanie</div>
  );
}

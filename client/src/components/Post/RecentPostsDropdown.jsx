import React from "react";
import { Menu, MenuItem, MenuButton, MenuList } from "@reach/menu-button";
import { FaChevronDown } from "react-icons/fa";
import usePosts from "./use-posts";
import "./RecentPostsDropdown.css";

export default function RecentPostsDropdown({ uid, onSelect }) {
  let consultations = usePosts(uid);

  //takes only 18 recent consultations to prevent big lists appearing on the screen

  if (consultations.length > 18) {
    consultations = consultations.slice(
      consultations.length - 18,
      consultations.length
    );
  }

  if (consultations && consultations.length === 0) {
    return null;
  }

  return (
    <Menu>
      <MenuButton
        disabled={!consultations}
        className="RecentPostsDropdownButton icon_button"
      >
        <span className="RecentPostsDropdownButton_span">Ostatnie wpisy</span>
        <FaChevronDown aria-hidden />
      </MenuButton>
      <MenuList>
        {consultations &&
          consultations
            .filter((post) => post.message.trim() !== "")
            .reverse()
            .map((post, index) => (
              <MenuItem key={index} onSelect={() => onSelect(post.message)}>
                {post.message}
              </MenuItem>
            ))}
      </MenuList>
    </Menu>
  );
}

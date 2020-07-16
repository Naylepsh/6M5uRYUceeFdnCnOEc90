import React from "react";
import { Menu, MenuItem, MenuButton, MenuList } from "@reach/menu-button";
import { FaChevronDown } from "react-icons/fa";
import usePosts from "./use-posts";

export default function RecentPostsDropdown({ uid, onSelect }) {
  const posts = usePosts(uid);

  //when there's no posts
  if (posts && posts.length === 0) {
    return null;
  }

  return (
    <Menu>
      <MenuButton
        disabled={!posts}
        className="RecentPostsDropdownButton icon_button"
      >
        <span>Ostatnie wpisy</span>
        <FaChevronDown aria-hidden />
      </MenuButton>
      <MenuList>
        {posts &&
          posts
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

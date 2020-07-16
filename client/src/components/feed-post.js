import React from "react";
import useDocWithCache from "./../use-doc-with-cache";
import { Link, useLocation } from "./../utils/react-router-next";
import Avatar from "./avatar";
import { format as formatDate, formatDistance } from "date-fns";

const stopPropagation = (event) => event.stopPropagation();

export default function FeedPost({ post }) {
  const user = useDocWithCache(`users/${post.uid}`);
  const ariaLink = useAriaLink(`/${post.uid}/${post.date}`);

  return user ? (
    <div className="FeedPost" {...ariaLink}>
      <Avatar uid={post.uid} size={100} />
      <div className="FeedPost_about">
        <Link
          onClick={stopPropagation}
          className="FeedPost_date"
          href={`/${post.uid}/${post.date}`}
        >
          {formatDate(post.date, "dddd, MMMM Do")}
        </Link>
        <div className="FeedPost_user_name">
          <Link onClick={stopPropagation} href={`/${user.uid}`}>
            {user.displayName}
          </Link>{" "}
          <span className="FeedPost_created_at">
            {formatDistance(post.createdAt, { addSuffix: true })}
          </span>{" "}
        </div>
        <div className="FeedPost_message">{post.message}</div>
      </div>
    </div>
  ) : (
    <div className="FeedPostShimmer" />
  );
}

function useAriaLink(href) {
  const { navigate } = useLocation();
  const role = "link";
  const tabIndex = "0";

  const onKeyDown = (event) => {
    if (event.key === " ") {
      event.preventDefault();
    }
    if (event.key === "Enter") {
      navigate(href);
    }
  };

  const onKeyUp = (event) => {
    event.preventDefault();
    if (event.key === " ") {
      navigate(href);
    }
  };

  const onClick = (event) => {
    navigate(href);
  };

  return { role, onKeyDown, onKeyUp, tabIndex, onClick };
}

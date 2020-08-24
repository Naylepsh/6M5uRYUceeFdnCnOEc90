import React from "react";
import useDocWithCache from "../../use-doc-with-cache";
import { Link, useLocation } from "../../utils/react-router-next";
import Avatar from "../Avatar/Avatar";
import { format as formatDate, distanceInWordsToNow } from "date-fns";
import { translateMonths, translateWeekdays } from "../../tools";
import "./FeedPost.css";

const plLocale = require("date-fns/locale/pl");

const stopPropagation = (event) => event.stopPropagation();

//Provides feed of recently created/editet posts

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
          {`${translateWeekdays(formatDate(post.date, "dddd"))}, ${formatDate(
            post.date,
            "DD"
          )} ${translateMonths(formatDate(post.date, "MMM")).toLowerCase()}`}
        </Link>
        <div className="FeedPost_user_name">
          <Link onClick={stopPropagation} href={`/${user.uid}`}>
            {user.displayName}
          </Link>{" "}
          <span className="FeedPost_created_at">
            {distanceInWordsToNow(post.createdAt, {
              addSuffix: true,
              locale: plLocale,
            })}
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

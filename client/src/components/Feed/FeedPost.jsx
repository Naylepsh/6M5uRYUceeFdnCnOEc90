import React from "react";
import useDocWithCache from "../../use-doc-with-cache";
import { format as formatDate, distanceInWordsToNow } from "date-fns";
import { translateMonths, translateWeekdays } from "../../tools";
import "./FeedPost.css";

const plLocale = require("date-fns/locale/pl");

//Provides feed of recently created/editet posts

export default function FeedPost({ post }) {
  const user = useDocWithCache(`users/${post.uid}`);

  return user ? (
    <div className="FeedPost">
      <div className="FeedPost_about">
        <div className="FeedPost_date">
          {`${translateWeekdays(formatDate(post.date, "dddd"))}, ${formatDate(
            post.date,
            "DD"
          )} ${translateMonths(formatDate(post.date, "MMM")).toLowerCase()}`}
        </div>
        <div className="FeedPost_user_name">
          <span>{user.displayName}</span>{" "}
          <span className="FeedPost_created_at">
            {distanceInWordsToNow(post.createdAt, {
              addSuffix: true,
              locale: plLocale,
            })}
          </span>{" "}
        </div>
        <div className="FeedPost_message">{post.message}</div>
        <div className="FeedPost_info">Lokalizacja: {post.place} </div>
        <div className="FeedPost_info">Uczeń: {post.student} </div>
        <div className="FeedPost_info">Grupa: {post.group} </div>
        <div className="FeedPost_info">Prowadzący: {post.lecturer}</div>
        <div className="FeedPost_info">
          Od: {post.startHour}       Do: {post.endHour}
        </div>
      </div>
    </div>
  ) : (
    <div className="FeedPostShimmer" />
  );
}

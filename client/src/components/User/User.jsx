import React from "react";
import { sortByCreatedAtDescending } from "../../tools";
import FeedPost from "../Feed/FeedPost";
import usePosts from "../Post/use-posts";
import { useParams } from "../../utils/react-router-next";
import useDocWithCache from "../../use-doc-with-cache";

export default function User() {
  const { uid } = useParams();
  const user = useDocWithCache(`users/${uid}`);
  return user ? (
    <div>
      <UserFeed user={user} />
    </div>
  ) : null;
}

function UserFeed({ user }) {
  const posts = usePosts(user.uid);
  return posts ? (
    <div className="Feed">
      {posts.sort(sortByCreatedAtDescending).map((post) => (
        <FeedPost key={post.id} post={post} />
      ))}
    </div>
  ) : null;
}

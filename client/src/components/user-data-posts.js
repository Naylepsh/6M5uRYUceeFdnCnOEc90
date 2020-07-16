import React from "react";
import { useParams } from "./utils/react-router-next";
import Posts from "./posts";

export default function UserDatePosts() {
  const params = useParams();
  return (
    <div className="PostsRoute">
      <Posts params={params} />
    </div>
  );
}

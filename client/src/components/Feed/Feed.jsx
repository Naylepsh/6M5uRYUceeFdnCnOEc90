import React, { useRef, useReducer, useEffect } from "react";
import FeedPost from "./FeedPost";
import { loadFeedPosts, subscribeToNewFeedPosts } from "../../tools";
import "./Feed.css";

const PER_PAGE = 3;
let feedState = null;

//Provides all features of feed

export default function Feed() {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "LOAD_POSTS":
          return { ...state, posts: action.posts };
        case "LOAD_NEW_POSTS":
          return { ...state, newPosts: action.posts };
        case "VIEWED_ALL":
          return { ...state, viewedAll: true };
        case "VIEW_NEW_POSTS":
          return {
            ...state,
            createdBefore: Date.now(),
            limit: state.limit + state.newPosts.length,
            posts: state.newPosts.concat(state.posts),
            newPosts: [],
          };
        case "VIEW_MORE":
          return { ...state, limit: state.limit + PER_PAGE };
        default: {
        }
      }
    },
    feedState || {
      createdBefore: Date.now(),
      viewedAll: false,
      limit: PER_PAGE,
      posts: null,
      newPosts: [],
    }
  );

  const { createdBefore, viewedAll, limit, posts, newPosts } = state;

  //helps to know when we've viewed all
  const lastPostIdRef = useRef();

  useEffect(() => {
    feedState = state;
  });

  useEffect(() => {
    let current = true;
    loadFeedPosts(createdBefore, limit).then((posts) => {
      if (current) {
        dispatch({ type: "LOAD_POSTS", posts });
      }
    });
    return () => (current = false);
  }, [createdBefore, limit]);

  useEffect(() => {
    return subscribeToNewFeedPosts(createdBefore, (posts) => {
      dispatch({ type: "LOAD_NEW_POSTS", posts });
    });
  }, [createdBefore]);

  useEffect(() => {
    if (posts && posts[posts.length - 1].id === lastPostIdRef.current) {
      dispatch({ type: "VIEWED_ALL" });
    }
  }, [posts]);

  const handleViewNewPosts = () => dispatch({ type: "VIEW_NEW_POSTS" });

  const handleViewMore = () => {
    lastPostIdRef.current = posts[posts.length - 1].id;
    dispatch({ type: "VIEW_MORE" });
  };

  const hasNewPosts = newPosts.length > 0;

  return posts ? (
    <div className="Feed">
      {hasNewPosts && (
        <div className="Feed_button_wrapper">
          <button
            className="Feed_new_posts_button icon_button"
            onClick={handleViewNewPosts}
          >
            Zobacz {newPosts.length} nowe notatki
          </button>
        </div>
      )}

      {posts.map((post) => (
        <FeedPost key={post.id} post={post} />
      ))}

      {!viewedAll && posts && (
        <div className="Feed_button_wrapper">
          <button
            className="Feed_new_posts_button icon_button"
            onClick={handleViewMore}
          >
            Zobacz więcej
          </button>
        </div>
      )}
    </div>
  ) : null;
}

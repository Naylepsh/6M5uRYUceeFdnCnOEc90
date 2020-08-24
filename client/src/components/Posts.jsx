import React, { useRef, useState, useEffect } from "react";
import { format as formatDate } from "date-fns";
import { useAppState } from "./../states/AppState";
import useDocWithCache from "./../use-doc-with-cache";
import NewPost from "./NewPost";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { deletePost, translateMonths } from "./../tools";
import usePosts from "./use-posts";
import "./Posts.css";

//This component is called when Day
//is clicked. Provides list of posts
//its content, author and titles

export default function Posts({ params }) {
  const [{ auth }] = useAppState();
  const { uid, date } = params;
  const user = useDocWithCache(`users/${uid}`);
  const [adding, setAdding] = useState(false);
  const [newPostId, setNewPostId] = useState(null);
  const addRef = useRef();

  const posts = usePosts(uid, { listen: !adding });

  const canAdd = auth.uid === uid;

  const handleAddNew = () => setAdding(true);

  const handleNewPostSuccess = (post) => {
    setAdding(false);
    setNewPostId(post.id);
  };

  useEffect(() => {
    if (!adding && addRef.current) {
      addRef.current.focus();
    }
  }, [adding]);

  const dayPosts = posts && posts.filter((post) => post.date === date);

  return posts && user ? (
    <div className="Posts">
      <div className="Post_content">
        <h2 className="Posts_date">{`${formatDate(
          date,
          "DD"
        )} ${translateMonths(
          formatDate(date, "MMM")
        ).toLowerCase()} ${formatDate(date, "YYYY")}`}</h2>
        <div className="Posts_posts">
          {dayPosts.length > 0 ? (
            dayPosts.map((post, index) => (
              <Post key={post.id} post={post} isNew={post.id === newPostId} />
            ))
          ) : (
            <div className="Posts_empty">Brak notatek.</div>
          )}
        </div>
        {canAdd &&
          (adding ? (
            <div className="Posts_adding">
              <NewPost
                takeFocus={adding}
                date={date}
                onSuccess={handleNewPostSuccess}
                showAvatar={false}
              />
            </div>
          ) : (
            <div className="Posts_add">
              <button
                ref={addRef}
                className="Posts_add_button icon_button"
                onClick={handleAddNew}
              >
                <FaPlusCircle />{" "}
                <span>{posts.length > 0 ? "Dodaj notatkę" : "Add one"}</span>
              </button>
            </div>
          ))}
      </div>
    </div>
  ) : null;
}

//Provides contents of post, and some informations
//about it + option to delete a post.

function Post({ post }) {
  const [{ auth }] = useAppState();
  const canDelete = auth.uid === post.uid;
  const handleDelete = () => deletePost(post.id);

  return (
    <div className="Post">
      <div className="Post_message">{post.message}</div>
      <div className="Post_info">Uczeń: {post.student}</div>
      <div className="Post_info">Prowadzący: {post.lecturer}</div>
      <div className="Post_info">Grupa: {post.group}</div>
      <div className="Post_info">Lokalizacja: {post.place}</div>
      <div className="Post_delete">
        {canDelete && (
          <button
            className="Post_delete_button icon_button"
            onClick={handleDelete}
          >
            <FaTrashAlt /> <span>Usuń</span>
          </button>
        )}
      </div>
    </div>
  );
}

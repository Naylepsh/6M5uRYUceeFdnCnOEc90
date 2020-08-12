import React, { useState, useRef, useEffect } from "react";
import { useAppState } from "./../states/AppState";
import { createPost, DATE_FORMAT } from "./../tools";
import { format as formatDate } from "date-fns";
import Avatar from "./Avatar";
import { FaHome, FaChevronDown } from "react-icons/fa";
import RecentPostsDropdown from "./RecentPostsDropdown";
import { Menu, MenuItem, MenuButton, MenuList } from "@reach/menu-button";
import "./NewPost.css";

const MAX_MESSAGE_LENGTH = 200;

export default function NewPost({ takeFocus, date, onSuccess, showAvatar }) {
  const [{ auth }] = useAppState();

  const [message, setMessage] = useState(
    getLocalStorageValue(makeNewPostKey(date)) || ""
  );

  const [place, setPlace] = useState(
    getLocalStorageValue(makeNewPostKey(date)) || ""
  );

  const [saving, setSaving] = useState(false);
  const formRef = useRef();
  const messageRef = useRef();
  const placeRef = useRef();

  useEffect(() => {
    setLocalStorage(makeNewPostKey(date), message, place);
  });

  useEffect(() => {
    if (takeFocus) {
      messageRef.current.focus();
    }
  }, [takeFocus]);

  const handleAboutChangeMessage = (event) => {
    setMessage(event.target.value);
  };

  const handleAboutChangePlace = (event) => {
    setPlace(event.target.value);
  };

  const tooMuchText = message.length > MAX_MESSAGE_LENGTH;

  const submit = (form) => {
    setSaving(true);

    createPost({
      message: messageRef.current.value,
      place: placeRef.current.value,
      date: formatDate(date, DATE_FORMAT),
      uid: auth.uid,
    }).then((post) => {
      setSaving(false);
      setMessage("");
      onSuccess(post);
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submit(event.target);
  };

  const handleMessageKeyDown = (event) => {
    if (event.metaKey && event.key === "Enter") {
      submit(event.target.form);
    }
  };

  const handleRecentSelect = (text) => {
    setMessage(text);
  };

  return (
    <div
      className={"NewPost" + (tooMuchText ? " NewPost_error" : "")}
      style={{ opacity: saving ? 0.25 : 1 }}
    >
      {showAvatar && <Avatar uid={auth.uid} size={70} />}
      <form ref={formRef} className="NewPost_form" onSubmit={handleSubmit}>
        <textarea
          ref={messageRef}
          className="NewPost_input"
          placeholder="Nowa notatka..."
          value={message}
          onChange={handleAboutChangeMessage}
          onKeyDown={handleMessageKeyDown}
        />
        <div className="NewPost_char_count">
          {message.length}/{MAX_MESSAGE_LENGTH}
        </div>
        <RecentPostsDropdown uid={auth.uid} onSelect={handleRecentSelect} />
        {/* <textarea
          ref={placeRef}
          className="NewPost_input"
          placeholder="Dodaj lokalizację"
          value={place}
          onChange={handleAboutChangePlace}
          onKeyDown={handleMessageKeyDown}
        /> */}
        <label for="place">Wybierz lokalizację: </label>
        <select name="place" id="place" ref={placeRef}>
          <option value="Pl. Solidarności - Zielona">
            Pl. Solidarności - Zielona
          </option>
          <option value="Pl. Solidarności - Niebieska">
            Pl. Solidarności - Niebieska
          </option>
          <option value="Pl. Solidarności - Żółta">
            Pl. Solidarności - Żółta
          </option>
          <option value="Zdalnie">Zdalnie</option>
        </select>
        <div className="NewPost_buttons">
          <div>
            <button disabled={saving} type="submit" className="icon_button cta">
              <FaHome /> <span>Zapisz</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function makeNewPostKey(date) {
  return `newPost:${formatDate(date, DATE_FORMAT)}`;
}

function getLocalStorageValue(key) {
  const val = localStorage.getItem(key);
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch (e) {
    return null;
  }
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

import React from "react";
import useDocWithCache from "./../use-doc-with-cache";
import usePosts from "./use-posts";
import "./Avatar.css";

//Provides all features of user avatar

export default function Avatar({ uid, size = 50, bg, className, ...rest }) {
  const user = useDocWithCache(`users/${uid}`);
  const posts = usePosts(uid);

  if (!user || !posts) {
    return (
      <div
        className={"Avatar empty " + className}
        style={{ width: size, height: size }}
        {...rest}
      />
    );
  }

  const { photoURL, displayName } = user;
  const stroke = size / 10;

  return (
    <div
      className={"Avatar " + className}
      style={{ width: size, height: size }}
      {...rest}
    >
      <div
        role="img"
        aria-label={`Avatar for ${displayName}`}
        className="Avatar_image"
        style={{
          backgroundImage: `url(${photoURL})`,
          width: size - stroke * 2 + 1,
          height: size - stroke * 2 + 1,
          top: stroke,
          left: stroke,
        }}
      />
    </div>
  );
}

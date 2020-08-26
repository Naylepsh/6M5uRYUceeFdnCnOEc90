import React from "react";
import { animated } from "react-spring";

export function CalendarAnimation({
  transitions,
  transitionDirection,
  children,
}) {
  return (
    <div className="Calendar_animation_overflow">
      {transitions.map(({ item, props: { y }, key }, index) => {
        if (!item) return null;
        const transform = getTransformProperty(y, transitionDirection);
        return (
          <animated.div
            key={key}
            className="Calendar_animation_wrapper"
            style={{ transform, zIndex: index }}
          >
            {children}
          </animated.div>
        );
      })}
    </div>
  );
}
function getTransformProperty(y, transitionDirection) {
  let transform = "translate3d(0px, 0%, 0px)";
  if (transitionDirection === "earlier") {
    transform = y.interpolate((y) => `translate3d(0px, ${y}%, 0px)`);
  } else if (transitionDirection === "later") {
    transform = y.interpolate((y) => `translate3d(0px, ${-y}%, 0px)`);
  }
  return transform;
}

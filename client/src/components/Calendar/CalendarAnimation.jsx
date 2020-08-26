import React, { useState } from "react";
import { useTransition, animated } from "react-spring";
import { useLocation } from "../../utils/react-router-next";
import { getStartDate } from "./use-start-date";

export function CalendarAnimation({ children }) {
  const { location } = useLocation();
  const startDate = getStartDate(location);

  const [prevStart, setPrevStart] = useState(startDate);
  const [transitionDirection, setTransitionDirection] = useState();
  if (prevStart !== startDate) {
    setTransitionDirection(startDate < prevStart ? "earlier" : "later");
    setPrevStart(startDate);
  }

  const transitions = useTransition(
    //gives informations for swiping calendar up/down
    { startDate },
    (item) => item.startDate,
    {
      from: { y: -105 },
      enter: { y: 0 },
      leave: { y: 105 },
      initial: null,
    }
  );

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

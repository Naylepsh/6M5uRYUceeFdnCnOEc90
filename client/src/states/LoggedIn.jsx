import React, { useEffect, Fragment } from "react";
import { Router, Route, DefaultRoute } from "./../utils/react-router-next";
import { fetchDoc, isValidDate } from "./../tools";
import { useAppState } from "./AppState";
import UserDatePosts from "./../components/Post/Posts";
import Feed from "./../components/Feed/Feed";
import TopBar from "./../components/TopBar";
import User from "./../components/User";
import NotFound from "../components/common/NotFound";
import Dashboard from "../components/Dashboard/Dashboard";

export default function LoggedIn() {
  const [{ auth, user }, dispatch] = useAppState();

  useEffect(() => {
    if (!user) {
      fetchDoc(`users/${auth.uid}`).then((user) => {
        dispatch({ type: "LOAD_USER", user });
      });
    }
  }, [user, auth.uid, dispatch]);

  return user ? (
    <Fragment>
      <TopBar />
      <div className="Main">
        <Router>
          <Route path=".">
            <Dashboard />
          </Route>
          <Route
            path=":uid/:date"
            matchState={(state) => state && state.fromCalendar}
            validate={hasValidDateParam}
          >
            <Dashboard />
          </Route>
          <Route path=":uid/:date" validate={hasValidDateParam}>
            <UserDatePosts />
          </Route>
          <Route path=":uid">
            <User />
          </Route>
          <Route path="feed">
            <Feed />
          </Route>
          <DefaultRoute>
            <NotFound />
          </DefaultRoute>
        </Router>
      </div>
    </Fragment>
  ) : null;
}

const hasValidDateParam = ({ params }) => {
  const [year, month, day] = params.date.split("-");
  const isValid = isValidDate(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10)
  );
  return isValid;
};

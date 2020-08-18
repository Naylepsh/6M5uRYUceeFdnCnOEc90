import React, { Fragment } from "react";
import { useLocation, useParams } from "../../utils/react-router-next";

import AnimatedDialog from "../AnimatedDialog";
import Posts from "../Posts";
import usePosts from "../use-posts";
import { useAppState } from "../../states/AppState";
import { Calendar } from "../Calendar/Calendar";

//This component is responsible for
//main page of aplication
//it calls Calendar component with
//actual date calculations

export default function Dashboard() {
  const [{ user }] = useAppState();
  const { location, navigate } = useLocation();
  const showDayInModal = location.state && location.state.fromCalendar;
  const params = useParams();
  const posts = usePosts(user.uid);

  return (
    <Fragment>
      <AnimatedDialog isOpen={showDayInModal} onDismiss={() => navigate(-1)}>
        <Posts params={params} />
      </AnimatedDialog>
      {posts ? (
        <div className="UserCalendar">
          <Calendar user={user} posts={posts} modalIsOpen={showDayInModal} />
        </div>
      ) : null}
    </Fragment>
  );
}

import React, { Fragment } from "react";
import { useLocation, useParams } from "../../utils/react-router-next";

import AnimatedDialog from "../AnimatedDialog";
import Posts from "../Post/Posts";
import usePosts from "../Post/use-posts";
import { useAppState } from "../../states/AppState";
import { Calendar } from "../Calendar/Calendar";
import { ProtectedComponents } from "../common/ProtectedComponent";

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
          <ProtectedComponents>
            <Calendar user={user} posts={posts} modalIsOpen={showDayInModal} />
          </ProtectedComponents>
        </div>
      ) : null}
    </Fragment>
  );
}

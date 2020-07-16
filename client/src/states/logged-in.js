import React, { useEffect, Fragment } from "react";
import { Router, Route, DefaultRoute } from "./../utils/react-router-next";
import { fetchDoc, isValidDate } from "./../tools";
import { useAppState } from "./app-state";
import UserDatePosts from "./../components/posts";
import Feed from "./../components/feed";

import React, { useEffect, Fragment } from "react";
import { Router, Route, DefaultRoute } from "./../utils/react-router-next";
import { fetchDoc, isValidDate } from "./../tools";
import { useAppState } from "./AppState";
import UserDatePosts from "./../components/Posts";
import Feed from "./../components/Feed";
import Dashboard from "./../components/Dashboard";
import TopBar from "./../components/TopBar";

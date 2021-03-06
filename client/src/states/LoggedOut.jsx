import React from "react";
import { Tabs, TabList, Tab, TabPanel, TabPanels } from "@reach/tabs";
import LoginForm from "../components/common/LoginForm";
import SignupForm from "./../components/common/SignupForm";
import "./LoggedOut.css";

// Main component for login/signup screen
// depending on clicked tab
// calls LoginForm or SignupForm

export default function LoggedOut() {
  return (
    <div className="LoggedOut">
      <Tabs>
        <TabList>
          <Tab>Zaloguj się</Tab>
          <Tab>Zarejestruj się</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <LoginForm />
          </TabPanel>
          <TabPanel>
            <SignupForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

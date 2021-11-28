import React from "react";

import { Route, Redirect } from "react-router-dom";

import Articles from "./Articles";
import HeaderDashboard from "./Header";
import SettingsPage from "./Settings";

function Dashboard() {
  return (
    <div className="w-full">
      <HeaderDashboard />
      <Redirect from="/" to="/articles" />
      <Route exact path="/articles" component={Articles} />
      <Route exact path="/settings" component={SettingsPage} />
    </div>
  );
}

export default Dashboard;

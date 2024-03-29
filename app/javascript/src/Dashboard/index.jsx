import React from "react";

import { Route } from "react-router-dom";

import Articles from "./Articles";
import CreateOrEditArticle from "./CreateOrEditArticle";
import HeaderDashboard from "./Header";
import SettingsPage from "./Settings";

function Dashboard() {
  return (
    <div className="w-full">
      <HeaderDashboard />
      <Route exact path="/" component={Articles} />
      <Route exact path="/settings" component={SettingsPage} />
      <Route exact path="/articles/new" component={CreateOrEditArticle} />
      <Route exact path="/articles/edit/:id">
        <CreateOrEditArticle isEdit />{" "}
        {/* We are reusing the same component for creating and editing article. isEdit lets know that article is being edited. */}
      </Route>
    </div>
  );
}

export default Dashboard;

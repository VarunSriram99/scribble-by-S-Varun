import React, { useState, useEffect } from "react";

import { PageLoader } from "neetoui";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { initializeLogger } from "common/logger";

import Dashboard from "./Dashboard";
import Public from "./Public";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeLogger(); // TODO: You have initalized logger but haven't `logger` but rather have used Logger by importing. This suggests to me that you haven't understood what this function does.
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <h1>
        <PageLoader />
      </h1>
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer />
      <Switch>
        <Route path="/public" component={Public} />
        <Route path="/" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;

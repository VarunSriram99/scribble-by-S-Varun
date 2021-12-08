import React, { useState, useEffect } from "react";

import Logger from "js-logger";
import { Toastr } from "neetoui/v2";
import { Redirect, Switch } from "react-router-dom";
import Cookie from "universal-cookie";

import { setAuthHeaders } from "apis/axios";
import redirectionsApi from "apis/redirections";
import siteSettingsApi from "apis/sitesettings";

import Articles from "./Articles";
import Header from "./Header";
import Login from "./Login";

import sessionsApi from "../apis/session";
import CenteredPageLoader from "../common/CenteredPageLoader";

function Public() {
  const [siteName, setSiteName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [redirections, setRedirections] = useState([]);
  const cookies = new Cookie();

  const fetchSiteDetails = async () => {
    try {
      setIsLoading(true);
      const { data } = await siteSettingsApi.fetchSiteSettings();
      setSiteName(data.site_name);
      if (!data.has_password) {
        const { data } = await sessionsApi.create();
        cookies.set("authToken", data.authentication_token, {
          expires: new Date(Date.now() + 3600000),
        });
        setAuthHeaders();
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    } catch (error) {
      Logger.log(error);
      Toastr.error(Error("Error in loading site details"));
    }
  };

  const checkLogin = () => {
    const authToken = cookies.get("authToken");
    !!authToken && setIsLoggedIn(true);
    setAuthHeaders();
  };

  const fetchRedirections = async () => {
    const { data } = await redirectionsApi.fetchRedirectionsData();
    setRedirections(data.Redirections);
  };

  useEffect(() => {
    checkLogin();
    fetchSiteDetails();
    fetchRedirections();
  }, []);

  if (isLoading) return <CenteredPageLoader />;

  return (
    <div className="w-full h-full">
      <Header siteName={siteName} />
      {isLoggedIn ? (
        <Articles siteName={siteName} />
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
      <Switch>
        {redirections.map((redirection, key) => (
          <Redirect
            key={key}
            exact
            from={`/public${redirection.from}`}
            to={`/public${redirection.to}`}
          />
        ))}
      </Switch>
    </div>
  );
}

export default Public;

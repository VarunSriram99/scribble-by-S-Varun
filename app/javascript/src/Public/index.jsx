import React, { useState, useEffect } from "react";

import { Redirect, Switch } from "react-router-dom";
import Cookie from "universal-cookie";

import { setAuthHeaders } from "apis/axios";
import redirectionsApi from "apis/redirections";
import sessionsApi from "apis/session";
import siteSettingsApi from "apis/sitesettings";

import Articles from "./Articles";
import Header from "./Header";
import Login from "./Login";

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
          expires: new Date(Date.now() + 3600000), // expires in one hour
        });
        setAuthHeaders();
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    } catch (error) {
      logger.log(error);
    }
  };

  const checkLogin = () => {
    const authToken = cookies.get("authToken");
    !!authToken && setIsLoggedIn(true);
    setAuthHeaders();
  };

  const fetchRedirections = async () => {
    try {
      const { data } = await redirectionsApi.fetchRedirectionsData();
      setRedirections(data.redirections);
    } catch (error) {
      logger.log(error);
    }
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

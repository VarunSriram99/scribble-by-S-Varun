import React, { useState, useEffect } from "react";

import Logger from "js-logger";
import { Toastr, Typography } from "neetoui/v2";
import { Route } from "react-router-dom";

import publicApi from "apis/public";

import FullArticle from "./FullArticle";
import Sidebar from "./Sidebar";

function Articles({ siteName }) {
  const [categoriesData, setCategoriesData] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data } = await publicApi.fetchPublic(); // TODO: What does this API name even mean? What does it mean to fetchPublic? How does it resonate well the business logic?
      setCategoriesData(
        data.categories.sort((a, b) => {
          if (a.order > b.order) return 1;
          else if (a.order < b.order) return -1;

          return 0;
        })
      );
    } catch (error) {
      Logger.log(error);
      Toastr.error(Error("Error in fetching public data!"));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="w-full flex">
      <Sidebar categoriesData={categoriesData} />
      <Route exact path="/public/:slug">
        <FullArticle />
      </Route>
      <Route exact path="/public">
        <div className="m-4 text-center w-4/5">
          <Typography style="h1">Welcome to {siteName}</Typography>
          <Typography style="h4" className="m-4">
            Please select an article from the Sidebar.
          </Typography>
        </div>
      </Route>
    </div>
  );
}

export default Articles;

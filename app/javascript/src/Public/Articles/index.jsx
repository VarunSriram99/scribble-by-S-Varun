import React, { useState, useEffect } from "react";

import { Typography } from "neetoui/v2";
import { Route } from "react-router-dom";

import publicApi from "apis/public";

import FullArticle from "./FullArticle";
import Sidebar from "./Sidebar";

function Articles({ siteName }) {
  const [categoriesData, setCategoriesData] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data } = await publicApi.fetchCategoriesWithArticles();
      setCategoriesData(data.categories);
    } catch (error) {
      logger.log(error);
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

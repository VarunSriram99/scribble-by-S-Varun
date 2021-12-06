import React, { useState, useEffect } from "react";

import Logger from "js-logger";
import { Toastr } from "neetoui/v2";
import { Route } from "react-router-dom";

import publicApi from "apis/public";

import FullArticle from "./FullArticle";
import Sidebar from "./Sidebar";

function Articles() {
  const [categoriesData, setCategoriesData] = useState([]);

  const fetchCategories = async () => {
    try {
      const { data } = await publicApi.fetchPublic();
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
    </div>
  );
}

export default Articles;

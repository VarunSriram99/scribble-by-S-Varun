import React, { useState, useEffect } from "react";

import categoriesApi from "apis/categories";

import Categories from "./Categories";
import General from "./General";
import Redirections from "./Redirections";
import SideBar from "./SideBar";

function SettingsPage() {
  const [currentSetting, setCurrentSetting] = useState("general");
  const [categoriesData, setCategoriesData] = useState([]);

  const fetchCategories = async () => {
    const { data } = await categoriesApi.fetchCategories();
    //To sort the categories based on order
    setCategoriesData(
      data.Categories.sort((a, b) => {
        if (a.order < b.order) return -1;

        if (a.order > b.order) return 1;

        return 0;
      })
    );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="h-full flex">
      <SideBar
        currentSetting={currentSetting}
        setCurrentSetting={setCurrentSetting}
      />
      <div className="h-full w-full flex justify-center my-8">
        {currentSetting === "general" && <General />}
        {currentSetting === "redirections" && <Redirections />}
        {currentSetting === "categories" && (
          <Categories
            categoriesData={categoriesData}
            fetchCategories={fetchCategories}
          />
        )}
      </div>
    </div>
  );
}

export default SettingsPage;

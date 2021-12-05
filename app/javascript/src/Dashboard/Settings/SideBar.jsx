import React from "react";

import classNames from "classnames";
import { Repeat, Settings, Seo } from "neetoicons";

function SideBar({ currentSetting, setCurrentSetting }) {
  const changeSetting = event => {
    setCurrentSetting(event.target.id);
  };

  const settingStyle =
    "flex items-center space-x-2 p-4 rounded-sm pointer-events-none delay-150";
  return (
    <div className="border-r w-4/12 h-screen">
      <div
        id="general"
        onClick={e => changeSetting(e)}
        className="cursor-pointer hover:bg-gray-100 m-4"
      >
        <div
          className={classNames(settingStyle, {
            "bg-indigo-50": currentSetting === "general",
          })}
        >
          <Settings />
          <div>
            General
            <div className="text-xs font-normal">
              Page Title, Brand Name & Meta Description
            </div>
          </div>
        </div>
      </div>
      <div
        id="redirections"
        onClick={e => changeSetting(e)}
        className="cursor-pointer hover:bg-gray-100 m-4"
      >
        <div
          className={classNames(settingStyle, {
            "bg-indigo-50": currentSetting === "redirections",
          })}
        >
          <Repeat />
          <div>
            Redirections
            <div className="text-xs font-normal">
              Create & configure redirection rules
            </div>
          </div>
        </div>
      </div>
      <div
        id="categories"
        onClick={e => changeSetting(e)}
        className="cursor-pointer hover:bg-gray-100 m-4"
      >
        <div
          className={classNames(settingStyle, {
            "bg-indigo-50": currentSetting === "categories",
          })}
        >
          <Seo />
          <div>
            Manage Categories
            <div className="text-xs font-normal">
              Edit and Reorder KB Structure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;

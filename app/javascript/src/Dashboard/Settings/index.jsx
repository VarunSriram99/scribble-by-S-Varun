import React, { useState } from "react";

import Categories from "./Categories";
import General from "./General";
import Redirections from "./Redirections";
import SideBar from "./SideBar";

function SettingsPage() {
  const [currentSetting, setCurrentSetting] = useState("general");

  return (
    <div className="h-full flex">
      <SideBar
        currentSetting={currentSetting}
        setCurrentSetting={setCurrentSetting}
      />
      <div className="h-full w-full flex justify-center my-8">
        {currentSetting === "general" && <General />}
        {currentSetting === "redirections" && <Redirections />}
        {currentSetting === "categories" && <Categories />}
      </div>
    </div>
  );
}

export default SettingsPage;

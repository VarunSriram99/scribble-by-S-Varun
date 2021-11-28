import React from "react";

import { Header } from "neetoui/v2/layouts";

import ActionBlock from "./ActionBlock";
import Title from "./Title";

function HeaderDashboard() {
  return (
    <Header
      title={<Title />}
      actionBlock={<ActionBlock />}
      className="border-b"
    />
  );
}

export default HeaderDashboard;

import React from "react";

import { Typography } from "neetoui/v2";

function Header({ siteName }) {
  return (
    <div className="flex p-4 w-full justify-center border-b">
      <Typography style="h3">{siteName}</Typography>
    </div>
  );
}

export default Header;

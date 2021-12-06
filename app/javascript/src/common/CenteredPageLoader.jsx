import React from "react";

import { PageLoader } from "neetoui/v2";

function CenteredPageLoader() {
  return (
    <div className="h-screen items-center">
      {" "}
      <PageLoader />{" "}
    </div>
  );
}

export default CenteredPageLoader;

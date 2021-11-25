import React, { useState, useEffect } from "react";

import { PageLoader } from "neetoui";

import { setAuthHeaders } from "apis/axios";
import { initializeLogger } from "common/logger";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeLogger();
    setAuthHeaders(setLoading);
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="text-red-600">
      Hello world
      <PageLoader />
    </div>
  );
}

export default App;

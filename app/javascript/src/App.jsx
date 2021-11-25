import React, { useState, useEffect } from "react";

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

  return <div>Hello world</div>;
}

export default App;

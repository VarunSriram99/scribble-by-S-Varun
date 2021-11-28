import React, { useState } from "react";

import SideBar from "./SideBar";
import Subheader from "./Subheader";
import TableView from "./TableView";

function Articles() {
  const [selectedColumns, setSelectedColumns] = useState([]);

  return (
    <div className="flex w-full">
      <SideBar />
      <div className="w-full flex flex-col">
        <Subheader
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
        />
        <TableView selectedColumns={selectedColumns} />
      </div>
    </div>
  );
}

export default Articles;

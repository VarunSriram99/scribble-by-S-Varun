import React, { useState, useEffect } from "react";

import SideBar from "./SideBar";
import Subheader from "./Subheader";
import TableView from "./TableView";

function Articles() {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentStatus, setCurrentStatus] = useState("All");
  const [articleData, setArticleData] = useState([]);
  const [articleSearch, setArticleSearch] = useState("");

  useEffect(() => {
    const seedData = [
      {
        title: "hello",
        date: "11-2-21",
        author: "someone",
        category: "General",
        status: "Published",
      },
      {
        title: "hello",
        date: "11-27-21",
        author: "someone",
        category: "General",
        status: "Published",
      },
    ];
    setArticleData([...seedData]);
  }, []);

  return (
    <div className="flex w-full">
      <SideBar
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
        currentStatus={currentStatus}
        setCurrentStatus={setCurrentStatus}
        articleData={articleData}
      />
      <div className="w-full flex flex-col">
        <Subheader
          selectedColumns={selectedColumns}
          setSelectedColumns={setSelectedColumns}
          articleSearch={articleSearch}
          setArticleSearch={setArticleSearch}
        />
        <TableView
          selectedColumns={selectedColumns}
          articleData={articleData}
          currentCategory={currentCategory}
          currentStatus={currentStatus}
          articleSearch={articleSearch}
        />
      </div>
    </div>
  );
}

export default Articles;

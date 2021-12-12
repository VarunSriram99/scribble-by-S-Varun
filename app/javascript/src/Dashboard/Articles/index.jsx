import React, { useState, useEffect } from "react";

import articlesApi from "apis/articles";

import DeleteArticle from "./DeleteArticle";
import SideBar from "./SideBar";
import Subheader from "./Subheader";
import TableView from "./TableView";

function Articles() {
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("");
  const [currentStatus, setCurrentStatus] = useState("All");
  const [articleData, setArticleData] = useState([]);
  const [articleSearch, setArticleSearch] = useState("");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [currentlyDeletedArticle, setCurrentlyDeletedArticle] = useState(-1);

  const fetchArticlesData = async () => {
    try {
      const { data } = await articlesApi.fetchArticles();
      setArticleData(data.articles);
    } catch (error) {
      logger.log(error);
    }
  };

  useEffect(() => {
    fetchArticlesData();
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
          setCurrentlyDeletedArticle={setCurrentlyDeletedArticle}
          setIsDeleteAlertOpen={setIsDeleteAlertOpen}
        />
      </div>
      <DeleteArticle
        isDeleteAlertOpen={isDeleteAlertOpen}
        setIsDeleteAlertOpen={setIsDeleteAlertOpen}
        currentlyDeletedArticle={currentlyDeletedArticle}
        fetchArticles={fetchArticlesData}
      />
    </div>
  );
}

export default Articles;

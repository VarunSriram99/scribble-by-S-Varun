import React from "react";

import { Alert } from "neetoui/v2";

import articlesApi from "apis/articles";

function DeleteArticle({
  isDeleteAlertOpen,
  setIsDeleteAlertOpen,
  currentlyDeletedArticle,
  fetchArticles,
}) {
  const handleDelete = async () => {
    try {
      await articlesApi.destroy(currentlyDeletedArticle);
      fetchArticles();
      setIsDeleteAlertOpen(false);
    } catch (error) {
      logger.log(error);
    }
  };

  return (
    <Alert
      title="Delete Article"
      message="Are you sure you want to delete this article?"
      isOpen={isDeleteAlertOpen}
      onClose={() => setIsDeleteAlertOpen(false)}
      onSubmit={() => handleDelete()}
    />
  );
}

export default DeleteArticle;

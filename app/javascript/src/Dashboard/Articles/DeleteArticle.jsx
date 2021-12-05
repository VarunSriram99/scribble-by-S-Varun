import React from "react";

import Logger from "js-logger";
import { Alert, Toastr } from "neetoui/v2";

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
      Toastr.success("Successfully deleted article!");
      setIsDeleteAlertOpen(false);
    } catch (error) {
      Logger.log(error);
      Toastr.error(Error("Error in deleting the article!"));
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

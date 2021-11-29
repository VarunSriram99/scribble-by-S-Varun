import React from "react";

import Logger from "js-logger";
import { Alert, Toastr } from "neetoui/v2";

import categoriesApi from "apis/categories";

function DeleteCategory({
  isDeleteAlertOpen,
  setIsDeleteAlertOpen,
  currentlyDeletedCategory,
  fetchCategories,
}) {
  const handleDelete = async () => {
    try {
      await categoriesApi.destroy(currentlyDeletedCategory);
      fetchCategories();
      Toastr.success("Successfully deleted category!");
      setIsDeleteAlertOpen(false);
    } catch (error) {
      Logger.log(error);
      Toastr.error(Error("Error in deleting the category!"));
    }
  };
  return (
    <Alert
      title="Delete Category"
      message="Are you sure you want to delete this category?"
      isOpen={isDeleteAlertOpen}
      onClose={() => setIsDeleteAlertOpen(false)}
      onSubmit={() => handleDelete()}
    />
  );
}

export default DeleteCategory;

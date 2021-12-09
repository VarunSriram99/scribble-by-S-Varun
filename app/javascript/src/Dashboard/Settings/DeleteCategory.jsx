import React from "react";

import { Alert } from "neetoui/v2";

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
      setIsDeleteAlertOpen(false);
    } catch (error) {
      logger.log(error);
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

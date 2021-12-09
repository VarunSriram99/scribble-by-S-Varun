import React from "react";

import { Alert } from "neetoui/v2";

import redirectionsApi from "apis/redirections";

function DeleteRedirection({
  isDeleteAlertOpen,
  setIsDeleteAlertOpen,
  currentlyDeletedRedirection,
  fetchRedirections,
}) {
  const handleDelete = async () => {
    try {
      await redirectionsApi.destroy(currentlyDeletedRedirection);
      fetchRedirections();
      setIsDeleteAlertOpen(false);
    } catch (error) {
      logger.log(error);
    }
  };

  return (
    <Alert
      title="Delete Redirection"
      message="Are you sure you want to delete this redirection?"
      isOpen={isDeleteAlertOpen}
      onClose={() => setIsDeleteAlertOpen(false)}
      onSubmit={() => handleDelete()}
    />
  );
}

export default DeleteRedirection;

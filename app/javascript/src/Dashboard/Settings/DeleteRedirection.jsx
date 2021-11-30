import React from "react";

import Logger from "js-logger";
import { Alert, Toastr } from "neetoui/v2";

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
      Toastr.success("Successfully deleted redirection!");
      setIsDeleteAlertOpen(false);
    } catch (error) {
      Logger.log(error);
      Toastr.error(Error("Error in deleting the redirection!"));
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

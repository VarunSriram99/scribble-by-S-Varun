import React, { useState, useEffect } from "react";

import Logger from "js-logger";
import { Edit, Delete, Check } from "neetoicons";
import { Typography, Button, Toastr, Input } from "neetoui/v2";

import redirectionsApi from "apis/redirections";

import DeleteRedirection from "./DeleteRedirection";

function Redirections() {
  const [redirectionsData, setRedirectionsData] = useState([]);
  const [isNewRedirectionOpen, setIsNewRedirectionOpen] = useState(false);
  const [newRedirection, setNewRedirection] = useState({ from: "", to: "" });
  const [newRedirectionErrors, setNewRedirectionErrors] = useState({
    from: "",
    to: "",
  });
  const [currentlyEditedRedirection, setCurrentlyEditedRedirection] =
    useState(-1);
  const [editRedirection, setEditRedirection] = useState({ from: "", to: "" });
  const [editRedirectionErrors, setEditRedirectionErrors] = useState({
    from: "",
    to: "",
  });
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [currentlyDeletedRedirection, setCurrentlyDeletedRedirection] =
    useState(-1);

  const fetchRedirections = async () => {
    try {
      const { data } = await redirectionsApi.fetchRedirectionsData();
      setRedirectionsData(data.Redirections);
    } catch (error) {
      Toastr.error(Error("Error in fetching Redirections data"));
      Logger.log(error);
    }
  };

  const validateCreate = () => {
    const fromPath = `/${newRedirection.from.trim()}`;
    const toPath = `/${newRedirection.to.trim()}`;
    const createErrors = { from: "", to: "" };
    if (redirectionsData.find(redirection => redirection.from === fromPath)) {
      createErrors.from = "From path has already been defined";
    }

    if (fromPath.split(" ").length > 1) {
      createErrors.from = "URL cannot have spaces";
    }

    if (toPath.split(" ").length > 1) {
      createErrors.to = "URL cannot have spaces";
    }

    if (fromPath === toPath) {
      createErrors.from = "To path cannot be equal to From path";
      createErrors.to = "To path cannot be equal to From path";
    }

    if (
      redirectionsData.find(
        redirection =>
          redirection.from === toPath && redirection.to === fromPath
      )
    ) {
      createErrors.from =
        "From and To paths form a loop with a previous redirection";
      createErrors.to =
        "From and To paths form a loop with a previous redirection";
    }
    setNewRedirectionErrors(createErrors);
    if (createErrors.from.length == 0 && createErrors.to.length == 0) {
      return true;
    }

    return false;
  };

  const validateEdit = () => {
    const fromPath = `/${editRedirection.from.trim()}`;
    const toPath = `/${editRedirection.to.trim()}`;
    const modifiedRedirectionsData = [...redirectionsData];
    const currentRedirectionIndex = modifiedRedirectionsData.findIndex(
      redirection => redirection.id === currentlyEditedRedirection
    );
    modifiedRedirectionsData.splice(currentRedirectionIndex, 1); // Remove the currently edit data so that duplicate from url won't be affected for current element
    const editErrors = { from: "", to: "" };
    if (
      modifiedRedirectionsData.find(
        redirection => redirection.from === fromPath
      )
    ) {
      editErrors.from = "From path has already been defined";
    }

    if (fromPath.split(" ").length > 1) {
      editErrors.from = "URL cannot have spaces";
    }

    if (toPath.split(" ").length > 1) editErrors.to = "URL cannot have spaces";

    if (fromPath === toPath) {
      editErrors.from = "To path cannot be equal to From path";
      editErrors.to = "To path cannot be equal to From path";
    }

    if (
      modifiedRedirectionsData.find(
        redirection =>
          redirection.from === toPath && redirection.to === fromPath
      )
    ) {
      editErrors.from =
        "From and To paths form a loop with a previous redirection";
      editErrors.to =
        "From and To paths form a loop with a previous redirection";
    }
    setEditRedirectionErrors(editErrors);
    if (editErrors.from.length == 0 && editErrors.to.length == 0) return true;

    return false;
  };

  const handleEdit = async () => {
    const isValid = validateEdit();
    if (isValid) {
      const fromPath = `/${editRedirection.from.trim()}`;
      const toPath = `/${editRedirection.to.trim()}`;
      try {
        await redirectionsApi.update(currentlyEditedRedirection, {
          redirection: { from: fromPath, to: toPath },
        });
        fetchRedirections();
        setCurrentlyEditedRedirection(-1);
        Toastr.success("Successfully edited redirection!");
      } catch (error) {
        Toastr.error(Error("Error in editing redirection"));
        Logger.log(error);
      }
    }
  };
  const handleDelete = id => {
    setCurrentlyDeletedRedirection(id);
    setIsDeleteAlertOpen(true);
  };
  const handleCreate = async () => {
    const isValid = validateCreate();
    if (isValid) {
      const fromPath = `/${newRedirection.from.trim()}`;
      const toPath = `/${newRedirection.to.trim()}`;
      try {
        await redirectionsApi.create({
          redirection: { from: fromPath, to: toPath },
        });
        fetchRedirections();
        setIsNewRedirectionOpen(false);
        Toastr.success("Successfully created redirection!");
      } catch (error) {
        Toastr.error(Error("Error in creating redirection"));
        Logger.log(error);
      }
    }
  };

  useEffect(() => {
    fetchRedirections();
  }, []);

  useEffect(() => {
    validateEdit();
  }, [editRedirection]);

  return (
    <div className="text-left w-8/12">
      <Typography style="h2">Redirections</Typography>
      <Typography style="body2" className="text-gray-500 mb-4">
        Create and configure redirection rules to send users from old links to
        new links. All redirections are performed with 301 status codes to be
        SEO friendly.
      </Typography>
      <div className="bg-indigo-50 p-4 w-full">
        <table className="w-full">
          <tr className="text-gray-400 m-2 border-4 border-transparent">
            <th className="p-4">FROM PATH</th>
            <th className="p-4">TO PATH</th>
            <th className="p-4">ACTIONS</th>
          </tr>
          {redirectionsData.map((redirection, key) =>
            currentlyEditedRedirection === redirection.id ? (
              <tr key={key} className="bg-white m-2 border-8 border-indigo-100">
                <td className="p-4">
                  <Input
                    prefix="https://scribble.com/"
                    type="text"
                    error={editRedirectionErrors.from}
                    value={editRedirection.from}
                    onChange={e =>
                      setEditRedirection({
                        ...editRedirection,
                        from: e.target.value,
                      })
                    }
                  />
                </td>
                <td className="p-4">
                  <Input
                    prefix="https://scribble.com/"
                    type="text"
                    error={editRedirectionErrors.to}
                    value={editRedirection.to}
                    onChange={e =>
                      setEditRedirection({
                        ...editRedirection,
                        to: e.target.value,
                      })
                    }
                  />
                </td>
                <td className="text-right">
                  <Button
                    style="icon"
                    icon={() => <Check />}
                    className="mx-4"
                    onClick={() => handleEdit()}
                  />
                </td>
              </tr>
            ) : (
              <tr key={key} className="bg-white m-2 border-8 border-indigo-100">
                <td className="p-4">{`https://scribble.com${redirection.from}`}</td>
                <td className="p-4">{`https://scribble.com${redirection.to}`}</td>
                <td>
                  <div className="space-x-4">
                    <Button
                      icon={Edit}
                      style="icon"
                      onClick={() => {
                        setCurrentlyEditedRedirection(redirection.id);
                        setEditRedirection({
                          from: redirection.from.slice(1),
                          to: redirection.to.slice(1),
                        });
                      }}
                    />
                    <Button
                      icon={Delete}
                      style="icon"
                      onClick={() => handleDelete(redirection.id)}
                    />
                  </div>
                </td>
              </tr>
            )
          )}
          {isNewRedirectionOpen && (
            <tr className="bg-white m-2 border-8 border-indigo-100">
              <td className="p-4">
                <Input
                  prefix="https://scribble.com/"
                  type="text"
                  error={newRedirectionErrors.from}
                  value={newRedirection.from}
                  onChange={e =>
                    setNewRedirection({
                      ...newRedirection,
                      from: e.target.value,
                    })
                  }
                  onKeyUp={() => validateCreate()}
                />
              </td>
              <td className="p-4">
                <Input
                  prefix="https://scribble.com/"
                  type="text"
                  error={newRedirectionErrors.to}
                  value={newRedirection.to}
                  onChange={e =>
                    setNewRedirection({ ...newRedirection, to: e.target.value })
                  }
                  onKeyUp={() => validateCreate()}
                />
              </td>
              <td className="text-right">
                <Button
                  style="icon"
                  icon={() => <Check />}
                  className="mx-4"
                  onClick={() => handleCreate()}
                />
              </td>
            </tr>
          )}
          <div className="p-4">
            <Button
              label="+ Add New Redirection"
              style="link"
              onClick={() => setIsNewRedirectionOpen(true)}
            />
          </div>
        </table>
      </div>
      <DeleteRedirection
        isDeleteAlertOpen={isDeleteAlertOpen}
        setIsDeleteAlertOpen={setIsDeleteAlertOpen}
        currentlyDeletedRedirection={currentlyDeletedRedirection}
        fetchRedirections={fetchRedirections}
      />
    </div>
  );
}

export default Redirections;

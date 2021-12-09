import React, { useState, useEffect } from "react";

import { Form, Formik } from "formik";
import { Edit, Delete, Check } from "neetoicons";
import { Typography, Button, PageLoader } from "neetoui/v2";
import { Input } from "neetoui/v2/formik";

import redirectionsApi from "apis/redirections";

import DeleteRedirection from "./DeleteRedirection";

function Redirections() {
  const [redirectionsData, setRedirectionsData] = useState([]);

  const [isNewRedirectionOpen, setIsNewRedirectionOpen] = useState(false);

  const [currentlyEditedRedirection, setCurrentlyEditedRedirection] =
    useState(-1);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [currentlyDeletedRedirection, setCurrentlyDeletedRedirection] =
    useState(-1);

  const [isLoading, setIsLoading] = useState(true);

  const fetchRedirections = async () => {
    setIsLoading(true);
    try {
      const { data } = await redirectionsApi.fetchRedirectionsData();
      setRedirectionsData(data.Redirections);
    } catch (error) {
      logger.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateRedirection = values => {
    const fromPath = `/${values.from.trim()}`;
    const toPath = `/${values.to.trim()}`;
    const modifiedRedirectionsData = [...redirectionsData];
    if (values.isEdit) {
      const currentRedirectionIndex = modifiedRedirectionsData.findIndex(
        redirection => redirection.id === currentlyEditedRedirection
      );
      modifiedRedirectionsData.splice(currentRedirectionIndex, 1); // Remove the currently edited data so that duplicate from url won't be affected for current element
    }
    const errors = { from: "", to: "" };
    if (
      modifiedRedirectionsData.find(
        redirection => redirection.from === fromPath
      )
    ) {
      errors.from = "From path has already been defined";
    }

    if (fromPath.split(" ").length > 1) {
      errors.from = "URL cannot have spaces";
    }

    if (toPath.split(" ").length > 1) {
      errors.to = "URL cannot have spaces";
    }

    if (fromPath === toPath) {
      errors.from = "From path cannot be equal to To path";
      errors.to = "To path cannot be equal to From path";
    }

    // If the "from" path of current redirection equal to "to" path of previous redirection and vice versa, it will form an infinite loop.
    if (
      modifiedRedirectionsData.find(
        redirection =>
          redirection.from === toPath && redirection.to === fromPath //check whether current "from" path equal to previous "to" path and vice versa
      )
    ) {
      errors.from = "From and To paths form a loop with a previous redirection";
      errors.to = "From and To paths form a loop with a previous redirection";
    }

    if (errors.from.length == 0 && errors.to.length == 0) return {};

    return errors;
  };

  const handleDelete = id => {
    setCurrentlyDeletedRedirection(id);
    setIsDeleteAlertOpen(true);
  };

  const handleEdit = async (fromPath, toPath) => {
    try {
      await redirectionsApi.update(currentlyEditedRedirection, {
        from: fromPath,
        to: toPath,
      });
      setCurrentlyEditedRedirection(-1);
    } catch (error) {
      logger.log(error);
    }
  };

  const handleCreate = async (fromPath, toPath) => {
    try {
      await redirectionsApi.create({ from: fromPath, to: toPath });
      setIsNewRedirectionOpen(false);
    } catch (error) {
      logger.log(error);
    }
  };

  const handleRedirectionSubmission = values => {
    const fromPath = `/${values.from.trim()}`;
    const toPath = `/${values.to.trim()}`;

    if (values.isEdit) handleEdit(fromPath, toPath);
    else handleCreate(fromPath, toPath);

    fetchRedirections();
  };

  useEffect(() => {
    fetchRedirections();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="text-left w-8/12">
      <Typography style="h2">Redirections</Typography>
      <Typography style="body2" className="text-gray-500 mb-4">
        Create and configure redirection rules to send users from old links to
        new links. All redirections are performed with 301 status codes to be
        SEO friendly.
      </Typography>
      <div className="bg-indigo-50 p-4 w-full">
        <div className="w-full">
          <div className="text-gray-400 border-4 border-transparent font-bold flex justify-between text-center">
            <div className="p-4">FROM PATH</div>
            <div className="p-4">TO PATH</div>
            <div className="p-4">ACTIONS</div>
          </div>
          {redirectionsData.map((redirection, key) =>
            currentlyEditedRedirection === redirection.id ? (
              <div
                key={key}
                className="bg-white border-4 border-indigo-100 w-full"
              >
                <Formik
                  initialValues={{
                    from: redirection.from.slice(1), //slice(1) because the path will be of form "/path" and we need only "path"
                    to: redirection.to.slice(1),
                    isEdit: true,
                  }}
                  validate={validateRedirection}
                  onSubmit={handleRedirectionSubmission}
                >
                  {({ setFieldValue }) => (
                    <Form className="flex justify-between items-center">
                      <div className="p-4">
                        <Input
                          prefix="https://scribble.com/"
                          type="text"
                          name="from"
                        />
                      </div>
                      <div className="p-4">
                        <Input
                          prefix="https://scribble.com/"
                          type="text"
                          name="to"
                        />
                      </div>
                      <div className="text-right">
                        <Button
                          style="icon"
                          icon={() => <Check />}
                          type="submit"
                          onClick={() => setFieldValue("isEdit", true)}
                          className="mx-4"
                        />
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            ) : (
              <div
                key={key}
                className="bg-white border-8 text-left border-indigo-100 flex items-center w-full justify-between"
              >
                <div className="p-4 text-left w-5/12 overflow-x-auto">{`https://scribble.com${redirection.from}`}</div>
                <div className="p-4 text-left w-5/12 overflow-x-auto">{`https://scribble.com${redirection.to}`}</div>
                <div>
                  <div className="space-x-4 w-2/12 flex mx-2">
                    <Button
                      icon={Delete}
                      style="icon"
                      onClick={() => handleDelete(redirection.id)}
                    />
                    <Button
                      icon={Edit}
                      style="icon"
                      onClick={() =>
                        setCurrentlyEditedRedirection(redirection.id)
                      }
                    />
                  </div>
                </div>
              </div>
            )
          )}
          {isNewRedirectionOpen && (
            <div className="bg-white border-8 border-indigo-100">
              <Formik
                initialValues={{ from: "", to: "", isEdit: false }}
                validate={validateRedirection}
                onSubmit={handleRedirectionSubmission}
              >
                {({ setFieldValue }) => (
                  <Form className="flex items-center w-full justify-between">
                    <div className="p-4">
                      <Input
                        prefix="https://scribble.com/"
                        type="text"
                        name="from"
                      />
                    </div>
                    <div className="p-4">
                      <Input
                        prefix="https://scribble.com/"
                        type="text"
                        name="to"
                      />
                    </div>
                    <div className="text-right">
                      <Button
                        style="icon"
                        icon={() => <Check />}
                        type="submit"
                        className="mx-4"
                        onClick={() => setFieldValue("isEdit", false)}
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          )}
          <div className="p-4">
            <Button
              label="+ Add New Redirection"
              style="link"
              onClick={() => setIsNewRedirectionOpen(true)}
            />
          </div>
        </div>
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

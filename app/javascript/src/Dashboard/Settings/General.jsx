import React, { useState, useEffect } from "react";

import classNames from "classnames";
import { Formik, Form } from "formik";
import Logger from "js-logger";
import { Check, Close } from "neetoicons";
import { Checkbox, Button } from "neetoui";
import { Typography, Toastr } from "neetoui/v2";
import { Input } from "neetoui/v2/formik";
import * as yup from "yup";

import sitesettingsApi from "apis/sitesettings";

function General() {
  const [hasPassword, setHasPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState(["length", "character"]);
  const [siteName, setSiteName] = useState("");
  const initialValues = hasPassword ? { name: "", password: "" } : { name: "" };
  const handleSubmit = async values => {
    try {
      hasPassword
        ? await sitesettingsApi.update({ site_settings: values })
        : await sitesettingsApi.update({
            site_settings: { name: values.name, password: null },
          });
      Toastr.success("Successfully updated general settings");
    } catch (error) {
      Logger.log(error);
      Toastr.error(Error("Couldn't update general settings"));
    }
  };
  const validationSchema = {
    name: yup.string().trim().required("Site name is required"),
  };
  const fetchSiteName = async () => {
    try {
      const { data } = await sitesettingsApi.fetchSiteSettings();
      setSiteName(data.site_name);
      setHasPassword(data.has_password);
    } catch (error) {
      Toastr.error("Couldn't fetch sitename");
      Logger.log(error);
    }
  };
  const validate = ({ password }) => {
    if (hasPassword) {
      // We are using seperate state to append arrays because there is need to handle two error messages simultaneously which is not available in yup.
      const items = [];
      if (password?.trim().length < 6) items.push("length");

      if (!password.match(/^((.*[A-Za-z])(.*[0-9])|(.*[0-9])(.*[A-Za-z]))$/)) {
        items.push("character");
      }
      setPasswordErrors(items);
      if (items.length != 0) return { password: "" }; // Return an empty string for the key password to let formik know there is an error but nothing to show in errors.
    }

    return {}; // Return empty object to let formik know that there are no errors
  };

  useEffect(() => {
    fetchSiteName();
  }, []);
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={yup.object(validationSchema)}
      validate={validate}
      enableReinitialize
    >
      {() => (
        <Form className="text-left w-1/3">
          <Typography style="h2"> General Settings</Typography>
          <Typography style="body2" className="text-gray-500">
            {" "}
            Configure general attributes of scribble.
          </Typography>
          <Input
            label="Site Name"
            className="my-4"
            placeholder={siteName}
            name="name"
          />
          <Typography style="body3" className="text-gray-400 border-b pb-4">
            {" "}
            Customize the site name which is used to show the site name in
            <br /> <span className="font-bold">Open Graph Tags.</span>{" "}
          </Typography>
          <Checkbox
            label="Password Protect Knowledge Base"
            className="m-2"
            checked={hasPassword}
            onChange={e => setHasPassword(e.target.checked)}
          />
          <div className={classNames({ hidden: !hasPassword })}>
            <Input label="Password" name="password" type="password" />
            <span className="flex items-center space-x-2">
              {passwordErrors.includes("length") ? (
                <Close size={15} className="text-red-600 font-bold" />
              ) : (
                <Check size={15} className="text-green-600 font-bold" />
              )}
              Have at least 6 characters
            </span>
            <span className="flex items-center space-x-2">
              {passwordErrors.includes("character") ? (
                <Close size={15} className="text-red-600 font-bold" />
              ) : (
                <Check size={15} className="text-green-600 font-bold" />
              )}
              Include at least 1 letter and 1 number
            </span>
          </div>
          <div className="flex space-x-2 my-4">
            <Button label="Save Changes" type="submit" />
            <Button label="Cancel" style="text" />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default General;

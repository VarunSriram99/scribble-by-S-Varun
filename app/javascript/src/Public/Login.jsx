import React from "react";

import { Formik, Form } from "formik";
import { Button } from "neetoui";
import { Typography } from "neetoui/v2";
import { Input } from "neetoui/v2/formik";
import Cookies from "universal-cookie";
import * as yup from "yup";

import { setAuthHeaders } from "apis/axios";
import sessionsApi from "apis/session";

import NotFound from "../../Assets/NotFound";

function Login({ setIsLoggedIn }) {
  const cookies = new Cookies();

  const submitForm = async values => {
    try {
      const { data } = await sessionsApi.create(values);
      //cookie expires in 1 hour
      cookies.set("authToken", data.authentication_token, {
        expires: new Date(Date.now + 3600000),
      });
      setAuthHeaders();
      setIsLoggedIn(true);
    } catch (error) {
      logger.log(error);
    }
  };

  return (
    <div className="flex justify-center w-full items-center h-full">
      <div className="flex w-1/2 justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <img src={NotFound} className="mt-4" />
          <div>
            <Typography style="h3" className="mt-8">
              Spinkart is password protected!
            </Typography>
            <Typography style="body3" className="text-gray-500">
              Enter the password to gain access to spinkart.
            </Typography>
            <Formik
              initialValues={{ password: "" }}
              onSubmit={submitForm}
              validationSchema={yup.object({
                password: yup.string().required("Please enter a password"),
              })}
            >
              {() => (
                <Form>
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="my-4"
                  />
                  <Button label="Continue" type="submit" />
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

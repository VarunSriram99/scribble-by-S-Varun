import React, { useState, useEffect } from "react";

import { Formik, Form } from "formik";
import Logger from "js-logger";
import { Down } from "neetoicons";
import { Toastr, Button } from "neetoui/v2";
import { Input, Select, Textarea } from "neetoui/v2/formik";
import { useParams, useHistory } from "react-router-dom";
import * as yup from "yup";

import articlesApi from "apis/articles";
import categoriesApi from "apis/categories";

function CreateOrEditArticle({ isEdit }) {
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({});
  const history = useHistory();

  const fetchArticle = async () => {
    try {
      const { data } = await articlesApi.show(id);
      isEdit
        ? setInitialValues({
            title: data.article.title,
            body: data.article.body,
            category: {
              value: data.article.category_id,
              label: data.article.category,
            },
          })
        : setInitialValues({
            title: "",
            body: "",
            category: "",
            publish: false,
          });
    } catch (error) {
      Logger.log(error);
      Toastr.error(Error("Error in fetching article."));
    }
  };

  const validationSchema = {
    title: yup.string().trim().required("Title is required"),
    category: yup.object().required("Category is required"),
    body: yup.string().trim().required("Body is required"),
  };

  const handleSubmit = async values => {
    if (!values.category.value) return false;
    try {
      const payload = {
        article: {
          title: values.title,
          category_id: values.category.value,
          body: values.body,
          publish: values.publish,
        },
      };
      isEdit
        ? await articlesApi.update(id, payload)
        : await articlesApi.create(payload);
      Toastr.success("Successfully created article");
      history.push("/");
    } catch (error) {
      Logger.log(error);
      Toastr.error(Error("Error in creating article"));
    }
    return true;
  };

  const fetchCategoriesData = async () => {
    try {
      const { data } = await categoriesApi.fetchCategories();

      //To sort the categories based on order
      setCategories(
        data.Categories.sort((a, b) => {
          if (a.order < b.order) return -1;

          if (a.order > b.order) return 1;

          return 0;
        })
      );
    } catch (error) {
      Logger.log(error);
      Toastr.error("Error in fetching Category data");
    }
  };

  useEffect(() => {
    fetchCategoriesData();
    isEdit && fetchArticle();
  }, []);

  return (
    <div className="flex justify-center w-full">
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object(validationSchema)}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, errors }) => (
          <Form className="w-1/2 my-6">
            <div className="flex space-x-4 items-center">
              <Input
                name="title"
                placeholder="Enter title of the article"
                label="Article Title"
                className="w-2/3"
                size="large"
                error={errors.title}
              />
              <Select
                name="category"
                placeholder="Category"
                label="Category"
                error={errors.category}
                className="w-1/3"
                options={categories.map(category => {
                  return { value: category.id, label: category.name };
                })}
              />
            </div>
            <Textarea
              label="Article Body"
              error={errors.body}
              rows={10}
              placeholder="Enter Article Body"
              className="mt-6"
              name="body"
            />
            <div className="flex mt-6 space-x-2 items-start">
              <div className="flex flex-col">
                <div className="bg-indigo-500 rounded-md cursor-pointer w-32 hover:bg-indigo-600 ease-in-out duration-500">
                  <div className="flex">
                    <button
                      className="flex items-center py-2 px-2 w-3/4 text-white focus:outline-none"
                      type="submit"
                      onClick={() => setFieldValue("publish", false)}
                    >
                      Save Draft
                    </button>
                    <div className="flex justify-center w-1/4 border-l border-white">
                      <button
                        className="text-white flex w-full h-full justify-center items-center focus:outline-none"
                        onClick={e => {
                          e.preventDefault();
                          setIsPublishOpen(!isPublishOpen);
                        }}
                      >
                        <Down size={15} />
                      </button>
                    </div>
                  </div>
                </div>
                {isPublishOpen && (
                  <button
                    className="flex justify-center bg-gray-200 hover:bg-gray-300 ease-in-out duration-500 p-2 rounded-md focus:outline-none"
                    type="submit"
                    onClick={() => setFieldValue("publish", true)}
                  >
                    Publish
                  </button>
                )}
              </div>
              <Button style="text" className="m-1" label="Cancel" href="/" />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateOrEditArticle;

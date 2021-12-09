import React, { useState, useEffect } from "react";

import { Formik, Form } from "formik";
import Logger from "js-logger";
import { Reorder, Edit, Delete, Check } from "neetoicons";
import { Typography, Button, Toastr, PageLoader } from "neetoui/v2";
import { Input } from "neetoui/v2/formik";

import categoriesApi from "apis/categories";

import DeleteCategory from "./DeleteCategory";

function Categories({ categoriesData, fetchCategories }) {
  const [categories, setCategories] = useState([]);
  const [currentlyDraggedCategory, setCurrentlyDraggedCategory] = useState(-1);
  const [isAddNewCategoryOpen, setIsAddNewCategoryOpen] = useState(false);
  const [currentlyEditedCategory, setCurrentlyEditedCategory] = useState(-1);
  const [currentlyDeletedCategory, setCurrentlyDeletedCategory] = useState(-1);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onDragStart = order => {
    setCurrentlyDraggedCategory(order);
  };

  const onDrop = async order => {
    const categoriesOrder = [...categories];
    try {
      setIsLoading(true);
      //draggedCategory is the category which is currently being dragged
      const draggedCategory = categories.findIndex(
        category => category.order == currentlyDraggedCategory
      );
      //droppedOverCategory is the category item over which the dragged category is dropped
      const droppedOverCategory = categories.findIndex(
        category => category.order == order
      );
      // If dragged category dropped over itself, no need to reorder.
      if (draggedCategory === droppedOverCategory) {
        setIsLoading(false);
        return;
      }

      // Reordering the element in the array
      const removedElement = categoriesOrder.splice(draggedCategory, 1);
      categoriesOrder.splice(droppedOverCategory, 0, ...removedElement);
      const ids = [];
      const orders = [];
      categoriesOrder.map((categoryOrder, index) => {
        ids.push(categoryOrder.id);
        orders.push({ order: index + 1 });
      });
      await categoriesApi.reorder({
        category: { reorder: { ids: ids, orders: orders } },
      });
      fetchCategories();
      setIsLoading(false);
    } catch (error) {
      Logger.log(error);
      Toastr.error(Error("Error in reordering!"));
    }
  };

  const handleDelete = id => {
    setCurrentlyDeletedCategory(id);
    setIsDeleteAlertOpen(true);
  };

  const validateCategory = values => {
    const currentValue = values.name.trim();
    if (currentValue?.length === 0) {
      return { name: "Category shouldn't be empty." };
    } else if (
      categories.find(category => {
        // When we check for uniqueness for an edited category, we should avoid comparing it with the initial value of itself.
        const skipCheckOfCurrentlyEditedValue = values.isEdit
          ? currentlyEditedCategory != category.id
          : true;
        return category.name == currentValue && skipCheckOfCurrentlyEditedValue;
      })
    ) {
      return { name: "Category should be unique." };
    }

    return {};
  };

  const CreateOrEditCategory = async values => {
    setIsLoading(true);
    try {
      if (!values.isEdit) {
        await categoriesApi.create({
          category: { name: values.name.trim() },
        });
        Toastr.success("Successfully created new category!");
        setIsAddNewCategoryOpen(false);
      } else {
        await categoriesApi.update(currentlyEditedCategory, {
          category: { name: values.name.trim() },
        });
        Toastr.success("Successfully edited category!");
        setCurrentlyEditedCategory(-1);
      }
      fetchCategories();
    } catch (error) {
      Logger.error(error);
      Toastr.error(
        Error(
          values.isEdit
            ? "Error in creating new category!"
            : "Error in editing category!"
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setCategories(categoriesData);
    setIsLoading(false);
  }, [categoriesData]);

  if (isLoading) {
    return (
      <div className="flex flex-no-wrap w-full h-screen items-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="text-left w-2/3">
      <Typography style="h2">Manage Categories</Typography>
      <Typography style="body2" className="text-gray-500">
        {" "}
        Create and configure the categories inside your scribble.
      </Typography>
      {isAddNewCategoryOpen ? (
        <Formik
          initialValues={{ name: "", isEdit: false }}
          validate={validateCategory}
          onSubmit={CreateOrEditCategory}
        >
          {({ setFieldValue }) => (
            <Form>
              <Input
                placeholder="New category name"
                name="name"
                suffix={
                  <Button
                    style="icon"
                    icon={Check}
                    type="submit"
                    onClick={() => setFieldValue("isEdit", false)}
                  />
                }
                className="w-1/3 m-4"
              />
            </Form>
          )}
        </Formik>
      ) : (
        <Button
          label="+ Add new category"
          style="link"
          size="large"
          className="m-4"
          onClick={() => setIsAddNewCategoryOpen(true)}
        />
      )}
      {categories?.map(category =>
        currentlyEditedCategory === category.id ? (
          <div
            key={category.id}
            id={category.order}
            className="w-full flex justify-between border-t p-4"
            draggable
            onDragStart={() => onDragStart(category.order)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(category.order)}
          >
            <div>
              <Formik
                initialValues={{ name: category.name, isEdit: true }}
                validate={validateCategory}
                onSubmit={CreateOrEditCategory}
              >
                {({ setFieldValue }) => (
                  <Form className="flex items-center">
                    <Reorder />
                    <Input
                      placeholder="New category name"
                      name="name"
                      suffix={
                        <Button
                          style="icon"
                          icon={Check}
                          onClick={() => setFieldValue("isEdit", true)}
                          type="submit"
                        />
                      }
                    />
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        ) : (
          <div
            key={category.id}
            id={category.order}
            className="w-full flex justify-between border-t p-4"
            draggable
            onDragStart={() => onDragStart(category.order)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(category.order)}
          >
            <div className="flex">
              <Reorder />
              <Typography style="h4">{category.name}</Typography>
            </div>
            <div className="space-x-4">
              <Button
                icon={Edit}
                style="icon"
                iconPosition="left"
                onClick={() => setCurrentlyEditedCategory(category.id)}
              />
              <Button
                icon={Delete}
                style="icon"
                iconPosition="left"
                onClick={() => handleDelete(category.id)}
              />
            </div>
          </div>
        )
      )}
      <DeleteCategory
        isDeleteAlertOpen={isDeleteAlertOpen}
        setIsDeleteAlertOpen={setIsDeleteAlertOpen}
        currentlyDeletedCategory={currentlyDeletedCategory}
        fetchCategories={fetchCategories}
      />
    </div>
  );
}

export default Categories;

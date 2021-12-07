import React, { useState, useEffect, useRef } from "react";

import Logger from "js-logger";
import { Reorder, Edit, Delete, Check } from "neetoicons";
import { Typography, Button, Toastr, Input, PageLoader } from "neetoui/v2";

import categoriesApi from "apis/categories";

import DeleteCategory from "./DeleteCategory";

function Categories({ categoriesData, fetchCategories }) {
  const [categories, setCategories] = useState([]);
  const [currentlyDraggedCategory, setCurrentlyDraggedCategory] = useState(-1);
  const [isAddNewCategoryOpen, setIsAddNewCategoryOpen] = useState(false);
  const [newCategoryError, setNewCategoryError] = useState("");
  const [currentlyEditedCategory, setCurrentlyEditedCategory] = useState(-1);
  const [currentlyDeletedCategory, setCurrentlyDeletedCategory] = useState(-1);
  const [editCategoryValue, setEditCategoryValue] = useState("");
  const [editCategoryError, setEditCategoryError] = useState("");
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const newCategoryReference = useRef();

  const onDragStart = event => {
    setCurrentlyDraggedCategory(event.target.id);
  };
  const categoriesOrder = [...categories];
  const onDrop = async event => {
    try {
      setIsLoading(true);
      //draggedCategory is the category which is currently being dragged
      const draggedCategory = categories.findIndex(
        category => category.order == currentlyDraggedCategory
      );
      //droppedOverCategory is the category item over which the dragged category is dropped
      const droppedOverCategory = categories.findIndex(
        category => category.order == event.currentTarget.id
      );
      // If dragged category dropped over itself, no need to reorder.
      if (draggedCategory === droppedOverCategory) return;

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

  const validateEditCategory = () => {
    const currentValue = editCategoryValue.trim();
    if (currentValue?.length === 0) {
      setEditCategoryError("Category shouldn't be empty.");
      return false;
    } else if (categories.find(category => category.name == currentValue)) {
      setEditCategoryError("Category should be unique.");
      return false;
    }
    setEditCategoryError("");
    return true;
  };

  const handleEdit = async () => {
    const isValid = validateEditCategory(); //Validation return true if validation passes
    if (isValid) {
      try {
        await categoriesApi.update(currentlyEditedCategory, {
          category: { name: editCategoryValue },
        });
        fetchCategories();
        Toastr.success("Successfully updated category!");
        setCurrentlyEditedCategory(-1);
        setEditCategoryValue("");
        setEditCategoryError("");
      } catch (error) {
        Toastr.error(Error("Error in updating the category!"));
        Logger.log(error);
      }
    }
  };

  const validateNewCategory = () => {
    const currentValue = newCategoryReference.current?.value?.trim();
    if (currentValue?.length === 0) {
      setNewCategoryError("Category shouldn't be empty.");
      return false;
    } else if (categories.find(category => category.name == currentValue)) {
      setNewCategoryError("Category should be unique.");
      return false;
    }
    setNewCategoryError("");
    return true;
  };

  const addNewCategory = async () => {
    const isValid = validateNewCategory(); //Validation return true if validation passes
    if (isValid) {
      try {
        await categoriesApi.create({
          category: { name: newCategoryReference.current?.value?.trim() },
        });
        fetchCategories();
        Toastr.success("Successfully created new category!");
        setIsAddNewCategoryOpen(false);
      } catch (error) {
        Logger.error(error);
        Toastr.error(Error("Error in creating new category!"));
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setCategories(categoriesData);
    setIsLoading(false);
  }, [categoriesData]);

  useEffect(() => {
    setIsLoading(true);
    validateEditCategory();
    setIsLoading(false);
  }, [editCategoryValue]);

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
        <Input
          placeholder="New category name"
          ref={newCategoryReference}
          error={newCategoryError}
          onChange={() => validateNewCategory()}
          suffix={
            <Button
              style="icon"
              icon={Check}
              onClick={() => addNewCategory()}
            />
          }
          className="w-1/3 m-4"
        />
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
            className="w-full flex justify-between border-t p-4"
          >
            <div className="flex">
              <Reorder />
              <Input
                placeholder="New category name"
                value={editCategoryValue}
                onChange={e => setEditCategoryValue(e.target.value)}
                error={editCategoryError}
                suffix={
                  <Button
                    style="icon"
                    icon={Check}
                    onClick={() => handleEdit()}
                  />
                }
              />
            </div>
          </div>
        ) : (
          <div
            key={category.id}
            id={category.order}
            className="w-full flex justify-between border-t p-4"
            draggable
            onDragStart={e => onDragStart(e)}
            onDragOver={e => e.preventDefault()}
            onDrop={e => onDrop(e)}
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
                onClick={() => {
                  setCurrentlyEditedCategory(category.id);
                  setEditCategoryValue(category.name);
                }}
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

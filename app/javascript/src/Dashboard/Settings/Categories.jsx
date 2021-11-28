import React, { useState, useEffect } from "react";

import Logger from "js-logger";
import { Reorder, Edit, Delete } from "neetoicons";
import { Typography, Button, Toastr } from "neetoui/v2";

import categoriesApi from "apis/categories";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [currentlyDraggedCategory, setCurrentlyDraggedCategory] = useState(-1);

  const onDragStart = event => {
    setCurrentlyDraggedCategory(event.target.id);
  };
  const onDrop = async event => {
    try {
      //draggedCategory is the category which is currently being dragged
      const draggedCategory = categories.find(
        category => category.order == currentlyDraggedCategory
      );
      //droppedOverCategory is the category item over which the dragged category is dropped
      const droppedOverCategory = categories.find(
        category => category.order == event.currentTarget.id
      );
      await categoriesApi.update(draggedCategory.id, {
        category: { order: droppedOverCategory.order },
      });
      await categoriesApi.update(droppedOverCategory.id, {
        category: { order: draggedCategory.order },
      });
      fetchCategories();
      Toastr.success("Successfully reordered!");
    } catch (error) {
      Logger.log(error);
      Toastr.error(Error("Error in reordering!"));
    }
  };
  const fetchCategories = async () => {
    const { data } = await categoriesApi.fetchCategories();
    //To sort the categories based on order
    setCategories(
      data.Categories.sort((a, b) => {
        if (a.order < b.order) return -1;

        if (a.order > b.order) return 1;

        return 0;
      })
    );
  };
  const handleEdit = () => {};
  const handleDelete = () => {};
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div className="text-left w-2/3">
      <Typography style="h2">Manage Categories</Typography>
      <Typography style="body2" className="text-gray-500">
        {" "}
        Create and configure the categories inside your scribble.
      </Typography>
      {categories.map(category => (
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
              onClick={e => handleEdit(e)}
            />
            <Button
              icon={Delete}
              style="icon"
              iconPosition="left"
              onClick={e => handleDelete(e)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Categories;

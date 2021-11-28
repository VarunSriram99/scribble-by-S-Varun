import React, { useState, useEffect, useRef } from "react";

import classnames from "classnames";
import Logger from "js-logger";
import { Plus, Search, Check } from "neetoicons";
import { Typography, Input, Button, Toastr } from "neetoui/v2";
import { MenuBar } from "neetoui/v2/layouts";

import categoriesApi from "apis/categories";

function SideBar() {
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

  //Validation for addNewCategory
  const validateAddNewCategory = () => {
    const currentValue = newCategory.current.value.trim();
    if (currentValue.length === 0) setError("Category shouldn't be empty.");
    else if (categories.find(category => category.name == currentValue)) {
      setError("Category should be unique.");
    } else setError("");
  };

  const addCategory = async () => {
    const currentValue = newCategory.current.value.trim();
    validateAddNewCategory();
    if (error.length === 0) {
      try {
        await categoriesApi.create({ category: { name: currentValue } });
        Toastr.success("Successfully added category");
        fetchCategories();
        setIsTextBoxCollapsed(true);
      } catch (error) {
        Logger.error(error);
        Toastr.error(Error("Something went wrong!"));
      }
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  const [isTextBoxCollapsed, setIsTextBoxCollapsed] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const newCategory = useRef();
  return (
    <MenuBar title="Articles" showMenu>
      <MenuBar.Block label="All" count={13} active />
      <MenuBar.Block label="Draft" count={2} />
      <MenuBar.Block label="Published" count={7} />
      <MenuBar.SubTitle
        iconProps={[
          {
            icon: Search,
          },
          {
            icon: Plus,
            onClick: () => setIsTextBoxCollapsed(!isTextBoxCollapsed),
          },
        ]}
      >
        <Typography style="h5" textTransform="uppercase" weight="bold">
          Categories
        </Typography>
      </MenuBar.SubTitle>
      <div className={classnames({ hidden: isTextBoxCollapsed })}>
        <Input
          error={error}
          ref={newCategory}
          onChange={() => validateAddNewCategory()}
          suffix={
            <Button style="icon" icon={Check} onClick={() => addCategory()} />
          }
        />
      </div>
      {categories.map((category, key) => (
        <MenuBar.Block key={key} label={category.name} count={80} />
      ))}
    </MenuBar>
  );
}

export default SideBar;

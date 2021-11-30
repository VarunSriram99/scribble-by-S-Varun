import React, { useState, useEffect, useRef } from "react";

import Logger from "js-logger";
import { Plus, Search, Check, Close } from "neetoicons";
import { Typography, Input, Button, Toastr } from "neetoui/v2";
import { MenuBar } from "neetoui/v2/layouts";

import categoriesApi from "apis/categories";

function SideBar({
  currentCategory,
  setCurrentCategory,
  currentStatus,
  setCurrentStatus,
  articleData,
}) {
  const [isTextBoxCollapsed, setIsTextBoxCollapsed] = useState(true);
  const [isSearchBoxCollapsed, setIsSearchBoxCollapsed] = useState(true);
  const [categories, setCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [error, setError] = useState("");
  const newCategory = useRef();

  const publishedStatuses = ["All", "Draft", "Published"];
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
    if (currentValue.length === 0) {
      setError("Category shouldn't be empty.");
      return false;
    } else if (categories.find(category => category.name == currentValue)) {
      setError("Category should be unique.");
      return false;
    }
    setError("");
    return true;
  };

  const addCategory = async () => {
    const currentValue = newCategory.current.value.trim();
    const isValid = validateAddNewCategory();
    if (isValid) {
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

  const handleCategoryChange = clickedCategory => {
    clickedCategory === currentCategory
      ? setCurrentCategory("")
      : setCurrentCategory(clickedCategory);
  };

  const countPublishedStatus = status =>
    status === "All"
      ? articleData.length
      : articleData.filter(article => article.status === status).length;
  const countCategory = category =>
    articleData.filter(article => article.category === category).length;

  const toggleSearch = () => {
    setIsSearchBoxCollapsed(!isSearchBoxCollapsed);
    !isTextBoxCollapsed && setIsTextBoxCollapsed(true);
    !isSearchBoxCollapsed && setCategorySearch("");
  };

  const toggleAddCategory = () => {
    setIsTextBoxCollapsed(!isTextBoxCollapsed);
    !isSearchBoxCollapsed && setIsSearchBoxCollapsed(true);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <MenuBar title="Articles" showMenu>
      {publishedStatuses.map((status, key) => (
        <MenuBar.Block
          key={key}
          label={status}
          count={countPublishedStatus(status)}
          active={status === currentStatus}
          onClick={() => setCurrentStatus(status)}
        />
      ))}
      <MenuBar.SubTitle
        iconProps={[
          {
            icon: isSearchBoxCollapsed ? Search : Close,
            onClick: () => {
              toggleSearch();
            },
          },
          {
            icon: isTextBoxCollapsed ? Plus : Close,
            onClick: () => {
              toggleAddCategory();
            },
          },
        ]}
      >
        <Typography style="h5" textTransform="uppercase" weight="bold">
          Categories
        </Typography>
      </MenuBar.SubTitle>
      {!isTextBoxCollapsed && (
        <Input
          error={error}
          ref={newCategory}
          placeholder="Add new category"
          onChange={() => validateAddNewCategory()}
          suffix={
            <Button style="icon" icon={Check} onClick={() => addCategory()} />
          }
          className="my-2"
        />
      )}
      {!isSearchBoxCollapsed && (
        <Input
          prefix={<Search />}
          placeholder="Search for a category"
          value={categorySearch}
          onChange={e => {
            setCategorySearch(e.target.value);
          }}
          className="my-2"
        />
      )}
      {categories
        .filter(category =>
          category.name.toLowerCase().includes(categorySearch.toLowerCase())
        )
        .map((category, key) => (
          <MenuBar.Block
            key={key}
            active={category.name === currentCategory}
            label={category.name}
            count={countCategory(category.name)}
            onClick={() => handleCategoryChange(category.name)}
          />
        ))}
    </MenuBar>
  );
}

export default SideBar;

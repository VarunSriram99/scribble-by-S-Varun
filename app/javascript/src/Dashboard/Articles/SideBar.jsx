import React, { useState, useEffect } from "react";

import { Formik, Form } from "formik";
import { Plus, Search, Check, Close } from "neetoicons";
import { Typography, Input, Button } from "neetoui/v2";
import { Input as FormikInput } from "neetoui/v2/formik";
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

  const publishedStatuses = ["All", "Draft", "Published"];

  const fetchCategories = async () => {
    try {
      const { data } = await categoriesApi.fetchCategories();
      //To sort the categories based on order
      setCategories(data.categories);
    } catch (error) {
      logger.log(error);
    }
  };

  //Validation for addNewCategory
  const validateAddNewCategory = values => {
    const currentValue = values.name.trim();
    if (currentValue.length === 0) {
      return { name: "Category shouldn't be empty." };
    } else if (categories.find(category => category.name == currentValue)) {
      return { name: "Category should be unique." };
    }

    return {};
  };

  const addCategory = async values => {
    const currentValue = values.name.trim();
    try {
      await categoriesApi.create({ name: currentValue });
      fetchCategories();
      setIsTextBoxCollapsed(true);
    } catch (error) {
      logger.error(error);
    }
  };

  const handleCategoryChange = clickedCategory => {
    setCurrentCategory(
      clickedCategory === currentCategory ? "" : clickedCategory
    );
  };

  const countPublishedStatus = status =>
    status === "All"
      ? articleData.length
      : articleData.filter(article => article.status === status).length;

  const countCategory = category =>
    articleData.filter(article => article.category === category).length;

  const toggleSearch = () => {
    setIsSearchBoxCollapsed(!isSearchBoxCollapsed);
    setIsTextBoxCollapsed(true);
    setCategorySearch("");
  };

  const toggleAddCategory = () => {
    setIsTextBoxCollapsed(!isTextBoxCollapsed);
    setIsSearchBoxCollapsed(true);
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
        <Formik
          initialValues={{ name: "" }}
          enableReinitialize
          validate={validateAddNewCategory}
          onSubmit={addCategory}
        >
          {() => (
            <Form>
              <FormikInput
                name="name"
                placeholder="Add new category"
                suffix={<Button style="icon" type="submit" icon={Check} />}
                className="my-2"
              />
            </Form>
          )}
        </Formik>
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

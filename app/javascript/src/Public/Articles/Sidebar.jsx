import React, { useState } from "react";

import { Right, Down } from "neetoicons";
import { NavLink } from "react-router-dom";

function Sidebar({ categoriesData }) {
  const [expandedCategories, setExpandedCategories] = useState([]);

  const addCategoryToExpandedCategories = key => {
    const currentlyExpandedCategories = [...expandedCategories];

    currentlyExpandedCategories.push(key);
    setExpandedCategories(currentlyExpandedCategories);
  };

  const removeCategoryFromExpandedCategories = key => {
    const currentlyExpandedCategories = [...expandedCategories];

    currentlyExpandedCategories.splice(
      currentlyExpandedCategories.indexOf(key),
      1
    );
    setExpandedCategories(currentlyExpandedCategories);
  };

  return (
    <div className="w-1/5 h-screen border-r ml-4 pt-8 overflow-y-auto">
      <ul className="space-y-4">
        {categoriesData.map((category, key) => (
          <li key={key}>
            <div
              className="flex flex-no-wrap items-center space-x-4 font-bold text-sm cursor-pointer"
              onClick={() =>
                expandedCategories.indexOf(key) === -1
                  ? addCategoryToExpandedCategories(key)
                  : removeCategoryFromExpandedCategories(key)
              }
            >
              {expandedCategories.indexOf(key) === -1 ? (
                <Right size={15} />
              ) : (
                <Down size={15} />
              )}
              {category.name}
            </div>
            {expandedCategories.indexOf(key) !== -1 && (
              <div className="text-xs ml-4 mt-4 space-y-2">
                {category.articles.map((article, categoryKey) => (
                  <li key={categoryKey}>
                    {article.slug && (
                      <NavLink
                        to={`/public/${article.slug}`}
                        activeClassName="text-indigo-500"
                        className="hover:no-underline hover:text-black text-gray-500 font-semibold"
                      >
                        {article.title}
                      </NavLink>
                    )}
                  </li>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;

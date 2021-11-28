import React from "react";

import { Down, Plus, Search } from "neetoicons";
import { Button, Checkbox } from "neetoui";
import { Input, Dropdown, Typography } from "neetoui/v2";

const columns = ["Title", "Date", "Author", "Category", "Status"];

function Subheader({ selectedColumns, setSelectedColumns }) {
  const handleColumnChange = event => {
    //Only unchecked columns are added into the selectedColumns array state to set them as hidden in react table
    const changeSelectedColumns = selectedColumns;
    if (event.target.checked) {
      const elementToBeRemoved = changeSelectedColumns.indexOf(
        event.target.name
      );
      changeSelectedColumns.splice(elementToBeRemoved, 1);
    } else {
      changeSelectedColumns.push(event.target.name);
    }
    setSelectedColumns([...changeSelectedColumns]);
  };
  return (
    <div className="flex justify-end space-x-2 items-center m-4">
      <div className="w-1/3">
        <Input placeholder="Search article title" prefix={<Search />} />
      </div>
      <Dropdown
        buttonStyle="secondary"
        label="Columns"
        icon={Down}
        className="h-8"
        closeOnSelect={false}
        buttonProps={{ size: "large" }}
      >
        <Typography style="h5" className="m-4">
          Columns
        </Typography>
        {columns.map((columnName, key) => (
          <div className="m-4" key={key}>
            <Checkbox
              label={columnName}
              name={columnName.toLowerCase()}
              checked={!selectedColumns.includes(columnName.toLowerCase())}
              onChange={event => handleColumnChange(event)}
            />
          </div>
        ))}
      </Dropdown>
      <Button
        label={
          <div className="flex items-center space-x-4">
            Add New Article
            <Plus size={18} />
          </div>
        }
        iconPosition="right"
        className="h-8"
      />
    </div>
  );
}

export default Subheader;

import React, { useState, useMemo, useEffect } from "react";

import { Edit, Delete } from "neetoicons";
import { Button, Typography } from "neetoui/v2";
import { useTable } from "react-table";

function TableView({
  selectedColumns,
  articleData,
  currentCategory,
  currentStatus,
  articleSearch,
}) {
  const handleEdit = () => {};
  const handleDelete = () => {};
  const [data, setData] = useState([]);
  const columns = useMemo(
    () => [
      {
        Header: "TITLE",
        accessor: "title",
        Cell: ({ value }) => (
          <div className="text-indigo-500 font-semibold">{value}</div>
        ),
      },
      {
        Header: "DATE",
        accessor: "date",
        Cell: ({ value }) => new Date(value).toDateString(),
      },
      {
        Header: "AUTHOR",
        accessor: "author",
      },
      {
        Header: "CATEGORY",
        accessor: "category",
      },
      {
        Header: "STATUS",
        accessor: "status",
      },
      {
        accessor: "id",
        Cell: value => {
          return (
            <div className="space-x-4">
              <Button
                icon={Edit}
                style="icon"
                iconPosition="left"
                onClick={e => handleEdit(value, e)}
              />
              <Button
                icon={Delete}
                style="icon"
                iconPosition="left"
                onClick={e => handleDelete(value.value, e)}
              />
            </div>
          );
        },
      },
    ],
    []
  );
  useEffect(() => {
    const filteredData = articleData
      .filter(article =>
        currentStatus != "All" ? article.status === currentStatus : true
      )
      .filter(article =>
        currentCategory.length != 0
          ? article.category === currentCategory
          : true
      )
      .filter(article =>
        article.title.toLowerCase().includes(articleSearch.toLowerCase())
      );
    setData(filteredData);
  }, [articleData, currentStatus, currentCategory, articleSearch]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setHiddenColumns,
  } = useTable({ columns, data });
  useEffect(() => {
    setHiddenColumns(selectedColumns);
  }, [selectedColumns]);

  return (
    <>
      <Typography style="h4" className="m-6">
        {data.length} Articles
      </Typography>
      <table {...getTableProps()} className="w-full h-10 my-4 p-10">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="pb-2">
              {headerGroup.headers.map(column => {
                return (
                  <th {...column.getHeaderProps()} className="text-gray-400">
                    {column.render("Header")}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="even:bg-gray-100 h-12">
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()} className="text-center">
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default TableView;

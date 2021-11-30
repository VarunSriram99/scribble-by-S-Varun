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
  const formatDate = date => {
    const formattedDate = new Date(date).toLocaleString("en-us", {
      month: "long",
      year: "numeric",
      day: "numeric",
    });
    const splitDate = formattedDate.split(" ");
    const day = parseInt(splitDate[1].slice(0, -1));
    let daySuffix = "th";
    if (day <= 3 || day >= 21) {
      switch (day % 10) {
        case 1:
          daySuffix = "st";
          break;
        case 2:
          daySuffix = "nd";
          break;
        case 3:
          daySuffix = "rd";
          break;
        default:
          daySuffix = "th";
      }
    }
    splitDate[1] = `${splitDate[1].slice(0, -1)}${daySuffix},`;
    return splitDate.join(" ");
  };
  const columns = useMemo(
    () => [
      {
        Header: "TITLE",
        accessor: "title",
        className: "w-1/4",
        Cell: ({ value }) => (
          <div className="text-indigo-500 font-semibold">{value}</div>
        ),
      },
      {
        Header: "DATE",
        accessor: "date",
        className: "w-2/12",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "AUTHOR",
        accessor: "author",
        Cell: ({ value }) => <div className="text-gray-500">{value}</div>,
      },
      {
        Header: "CATEGORY",
        accessor: "category",
        Cell: ({ value }) => <div className="text-gray-500">{value}</div>,
      },
      {
        Header: "STATUS",
        accessor: "status",
        Cell: ({ value }) => <div className="text-gray-500">{value}</div>,
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
      <table {...getTableProps()} className="w-full h-10 m-4 p-10">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="pb-2 text-left"
            >
              {headerGroup.headers.map(column => {
                return (
                  <th
                    {...column.getHeaderProps()}
                    className={`text-gray-400 ${column.className}`}
                  >
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
                    <td {...cell.getCellProps()} className="text-left">
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

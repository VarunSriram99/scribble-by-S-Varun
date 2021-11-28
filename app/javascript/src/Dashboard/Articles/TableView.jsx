import React, { useMemo, useEffect } from "react";

import { Edit, Delete } from "neetoicons";
import { Button } from "neetoui/v2";
import { useTable } from "react-table";

function TableView({ selectedColumns }) {
  const handleEdit = () => {};
  const handleDelete = () => {};
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
  const data = [
    {
      title: "hello",
      date: "11-27-21",
      author: "someone",
      category: "General",
      status: "Published",
    },
    {
      title: "hello",
      date: "11-27-21",
      author: "someone",
      category: "General",
      status: "Published",
    },
  ];
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
  );
}

export default TableView;

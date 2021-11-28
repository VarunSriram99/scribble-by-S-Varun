import React from "react";

import { Edit, Delete } from "neetoicons";
import { Typography, Button } from "neetoui/v2";

function Redirections() {
  const handleEdit = () => {};
  const handleDelete = () => {};

  return (
    <div className="text-left w-1/2">
      <Typography style="h2">Redirections</Typography>
      <Typography style="body2" className="text-gray-500">
        Create and configure redirection rules to send users from old links to
        new links. All redirections are performed with 301 status codes to be
        SEO friendly.
      </Typography>
      <div className="bg-indigo-50 p-4 w-full">
        <table className="w-full">
          <tr className="text-gray-400 m-2 border-4 border-transparent">
            <th className="p-4">FROM PATH</th>
            <th className="p-4">TO PATH</th>
            <th className="p-4">ACTIONS</th>
          </tr>
          <tr className="bg-white m-2 border-8 border-indigo-100">
            <td className="p-4">https://scribble.com/welcome</td>
            <td className="p-4">https://scribble.com</td>
            <td>
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
            </td>
          </tr>
          <tr className="bg-white m-2 border-8 border-indigo-100">
            <td className="p-4">https://scribble.com/about</td>
            <td className="p-4">https://scribble.com/about-us</td>
            <td>
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
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default Redirections;

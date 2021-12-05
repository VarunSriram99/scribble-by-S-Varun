import React from "react";

import { Link, NavLink } from "react-router-dom";

function Title() {
  return (
    <div className="text-lg space-x-6 mx-4">
      <Link to="/">Scribble</Link>
      <NavLink
        className="text-gray-400 font-semibold hover:no-underline hover:text-gray-600"
        activeClassName="text-indigo-500"
        to="/"
        exact
      >
        Articles
      </NavLink>
      <NavLink
        className="text-gray-400 font-semibold hover:no-underline hover:text-gray-600"
        activeClassName="text-indigo-500"
        to="/settings"
      >
        Settings
      </NavLink>
    </div>
  );
}

export default Title;

import React from "react";

import { ExternalLink } from "neetoicons";
import { Button } from "neetoui/v2";

function ActionBlock() {
  return (
    <Button
      style="secondary"
      label="Preview"
      icon={ExternalLink}
      className="mx-4"
    />
  );
}

export default ActionBlock;

import { LoaderIcon } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <LoaderIcon className="h-6 w-6 text-muted-foreground animate-spin" />
    </div>
  );
};

export default Loading;

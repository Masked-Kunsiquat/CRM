
"use client";
import { Spinner } from "flowbite-react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-4">
      <Spinner aria-label="Loading..." />
    </div>
  );
};

export default Loader;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import CreateCategoryItem from "./categoryCreation";
import { ArrowLeft } from "lucide-react";

const categoryNameId = {
  books: 17,
  cuisine: 5,
  festivals: 1,
  "folk-costumes": 14,
  "folk-dance": 2,
  "folk-handicraft": 12,
  handicrafts: 12,
  "folk-music": 3,
  "folk-rituals": 15,
  rituals: 15,
  "folk-tales": 13,
  languages: 19,
  scripts: 18,
};

export default function UploadItemCreation() {
  const { categoryName } = useParams();

  // Log for debugging
  console.log("Category Creation page:", categoryName);
  console.log("Category ID:", categoryNameId[categoryName]);

  // Check if categoryName is valid
  if (!categoryName || !categoryNameId[categoryName]) {
    return <div>Loading...</div>;
  }

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="pb-6">
      <button
        onClick={handleBack}
        className="flex p-6 items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to upload</span>
      </button>

      <CreateCategoryItem
        categoryId={String(categoryNameId[categoryName])}
        onSuccessRoute={"/content-status"}
      />
    </div>
  );
}

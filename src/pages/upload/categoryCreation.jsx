import React, { useState, useEffect } from "react";
import { Loader2, AlertTriangle, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RenderAttributes from "./renderAttributes";

const CreateCategoryItem = ({ categoryId, onSuccessRoute }) => {
  const navigate = useNavigate();
  console.log("This is the category id:", categoryId);

  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryAttributes, setCategoryAttributes] = useState([]);
  const [attributeTypes, setAttributeTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [selectedCategoryForAttr, setSelectedCategoryForAttr] = useState("");
  const [newAttribute, setNewAttribute] = useState({
    name: "",
    description: "",
    is_required: false,
    attribute_type_id: "",
  });
  const [selectedCategoryForItem, setSelectedCategoryForItem] =
    useState(categoryId);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [attributeValues, setAttributeValues] = useState({});
  const [error, setError] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  useEffect(() => {
    fetchCategoryAttributes(categoryId);
    setSelectedCategoryForItem(categoryId);
    fetchCategoryAttributes(categoryId);
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchAttributeTypes();
    if (selectedCategoryForAttr)
      fetchCategoryAttributes(selectedCategoryForAttr);
  }, [selectedCategoryForAttr]);

  // Load user from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing userData:", error);
          localStorage.removeItem("userData");
        }
      }
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://arabhaya2.bidabhadohi.com/api/category");
      const data = await response.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchAttributeTypes = async () => {
    try {
      const response = await fetch("https://arabhaya2.bidabhadohi.com/api/attributeTypes");
      const data = await response.json();
      setAttributeTypes(data.data);
    } catch (error) {
      console.error("Error fetching attribute types:", error);
    }
  };

  const fetchCategoryAttributes = async (categoryId) => {
    const query = `https://arabhaya2.bidabhadohi.com/api/category/attributes?category_id=${categoryId}`;
    try {
      const response = await fetch(query);
      const data = await response.json();
      if (data.success) setCategoryAttributes(data.data);
    } catch (error) {
      console.log("got the error");
      console.log(error);
      console.error("Error fetching category attributes:", error);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://arabhaya2.bidabhadohi.com/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDescription,
          user_id: 1,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNewCategoryName("");
        setNewCategoryDescription("");
        fetchCategories();
      } else {
        setError(data.error || "Failed to create category");
      }
    } catch (error) {
      setError("Error creating category: " + error.message);
    }
    setLoading(false);
  };

  const handleCreateCategoryAttribute = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://arabhaya2.bidabhadohi.com/api/category/attributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: selectedCategoryForAttr,
          category_name:
            categories.find(
              (cat) => cat.id.toString() === selectedCategoryForAttr
            )?.name || "",
          attribute_name: newAttribute.name,
          description: newAttribute.description,
          attribute_type_id: parseInt(newAttribute.attribute_type_id),
          is_required: newAttribute.is_required,
          user_id: 1,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNewAttribute({
          name: "",
          description: "",
          is_required: false,
          attribute_type_id: "",
        });
        fetchCategoryAttributes(selectedCategoryForAttr);
      } else {
        setError(data.error || "Failed to create attribute");
      }
    } catch (error) {
      setError("Error creating attribute: " + error.message);
    }
    setLoading(false);
  };

  const getAttributeTypeId = (attributeId) => {
    const attribute = categoryAttributes.find(
      (attr) => attr.id === attributeId
    );
    return attribute?.attribute_type_id;
  };

  const handleStructureChange = (typeId, value) => {
    if ([6].includes(typeId)) {
      return { value: [value.value] };
    }
    if ([8, 9, 10, 11].includes(typeId)) {
      return [value.value];

    } else {
      return value;
    }
    // if ([6, 8, 9, 10, 11].includes(typeId)) {
    //   return { value: [value.value] };
    // } else {
    //   return value;
    // }
  };
  // Validation function to check if all required fields are filled
  const isFormValid = () => {
    // Check newItemName (required by default)
    if (!newItemName) return false;

    // Check required attributes
    for (const attr of categoryAttributes) {
      if (attr.is_required) {
        const value = attributeValues[attr.id]?.value;
        if (!value) return false;

        // Special validation for complex types (Audio, Video, Document)
        const typeId = attr.attribute_type_id;
        if ([8, 9, 10].includes(typeId)) {
          const obj = value;
          if (typeId === 8) {
            // Audio
            if (
              !obj.title ||
              !obj.description ||
              !obj.file_path ||
              !obj.thumbnail_path ||
              !obj.lyrics ||
              !obj.genre?.length ||
              !obj.composer ||
              !obj.performers?.length ||
              !obj.instruments?.length
            ) {
              return false;
            }
          } else if (typeId === 9) {
            // Video
            if (
              !obj.title ||
              !obj.description ||
              !obj.file_path ||
              !obj.thumbnail_path
            ) {
              return false;
            }
          } else if (typeId === 10) {
            // Document
            if (
              !obj.title ||
              !obj.description ||
              !obj.file_path ||
              !obj.thumbnail_path
            ) {
              return false;
            }
          }
        }
      }
    }
    return true;
  };

  const handleCreateCategoryItem = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const attributeArray = Object.entries(attributeValues)
      .filter(([id, value]) => value)
      .map(([id, value]) => {
        const attribute = categoryAttributes.find(
          (attr) => attr.id.toString() === id
        );
        return {
          attribute_id: parseInt(id),
          attribute_name: attribute?.name,
          attribute_type_id: attribute?.attribute_type_id,
          attribute_value: handleStructureChange(
            attribute?.attribute_type_id,
            value
          ),
        };
      });

    const payload = {
      category_id: selectedCategoryForItem,
      name: newItemName,
      description: newItemDescription,
      user_id: user.id,
      attributes: attributeArray,
    };

    // console.log("Attribute data");
    // console.log(attributeValues)

    // console.log("The payload");
    // console.log(payload)

    try {
      const response = await fetch("https://arabhaya2.bidabhadohi.com/api/category/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        setNewItemName("");
        setNewItemDescription("");
        setAttributeValues({});
        navigate(onSuccessRoute);
      } else {
        setError(data.error || "Failed to create category item");
      }

      console.log("this is response")
      console.log(response)
    } catch (error) {
      console.log("got the error");
      console.log(error);
      console.log(error.message);
      setError("Error creating category item: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Create Category Item for{" "}
            {
              categories.find(
                (cat) => cat.id.toString() === selectedCategoryForItem
              )?.name
            }
          </h1>
        </div>
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-[10px] p-4 flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <p className="ml-3 text-red-600">{error}</p>
            </div>
          )}
          <div className="space-y-6">
            <form onSubmit={handleCreateCategoryItem} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newItemDescription}
                    onChange={(e) => setNewItemDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter description"
                  />
                </div>
              </div>
              {selectedCategoryForItem && categoryAttributes.length > 0 && (
                <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {categoryAttributes.map((attr) => (
                      <div
                        key={attr.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="mb-2">
                          <label className="block text-md font-medium text-gray-700">
                            {attr.description}{" "}
                            {attr.is_required ? (
                              <span className="text-red-500">*</span>
                            ) : (
                              ""
                            )}
                          </label>
                     
                        </div>
                        <RenderAttributes
                          attribute={attr}
                          attributeValues={attributeValues}
                          setAttributeValues={setAttributeValues}
                          attributeTypes={attributeTypes}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className={`w-full py-2.5 px-4 rounded-[10px] text-white font-medium transition-colors ${
                  loading || !isFormValid()
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Category Item"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryItem;

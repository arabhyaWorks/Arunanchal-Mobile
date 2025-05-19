import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Music2,
  Video,
  BookText,
  Shirt,
  Sparkles,
  Calendar,
  Utensils,
  Hammer,
  Book,
  ScrollText,
  Languages,
  ArrowLeft,
  Upload,
} from "lucide-react";

const contentTypes = [
  {
    id: "folk-music",
    name: "Folk Music",
    icon: Music2,
    description: "Traditional songs and musical performances",
  },
  {
    id: "folk-dance",
    name: "Folk Dance",
    icon: Video,
    description: "Traditional dance performances and ceremonies",
  },
  {
    id: "festivals",
    name: "Festivals",
    icon: Calendar,
    description: "Cultural celebrations and events",
  },
  {
    id: "cuisine",
    name: "Cuisine",
    icon: Utensils,
    description: "Traditional food and recipes",
  },
  {
    id: "folk-tales",
    name: "Folk Tales",
    icon: BookText,
    description: "Stories passed down through generations",
  },
  {
    id: "folk-costumes",
    name: "Traditional Costumes",
    icon: Shirt,
    description: "Traditional dress and attire",
  },
  {
    id: "folk-rituals",
    name: "Rituals",
    icon: Sparkles,
    description: "Sacred ceremonies and practices",
  },

  {
    id: "folk-handicraft",
    name: "Handicrafts",
    icon: Hammer,
    description: "Traditional arts and crafts",
  },
  {
    id: "books",
    name: "Books",
    icon: Book,
    description: "Published works about culture",
  },
  {
    id: "scripts",
    name: "Scripts",
    icon: ScrollText,
    description: "Traditional writing systems",
  },
  {
    id: "languages",
    name: "Languages",
    icon: Languages,
    description: "Indigenous languages and dialects",
  },
];

export default function UploadContent() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    navigate(`/upload/${typeId}`);
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Content</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900  mb-2">
            Upload New Content
          </h1>
          <p className="text-gray-600 ">
            Select the type of content you want to upload
          </p>
        </div>

        {/* Content Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeSelect(type.id)}
              className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200  text-left"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-teal-500/10 group-hover:from-blue-500 group-hover:to-teal-500 transition-all">
                  <type.icon className="h-6 w-6 text-blue-600  group-hover:text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900  group-hover:text-blue-600 ">
                  {type.name}
                </h3>
              </div>
              <p className="text-gray-600  text-sm mb-4">
                {type.description}
              </p>
              <div className="flex items-center gap-2 text-blue-600 ">
                <Upload className="h-4 w-4" />
                <span className="text-sm font-medium">Start Upload</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

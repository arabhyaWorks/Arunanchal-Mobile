import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ChevronLeft
} from 'lucide-react';
import { TranslatableText } from '../components/TranslatableText';

const contentTypes = [
  {
    id: "folk-music",
    name: "Folk Music",
    icon: Music2,
    description: "Traditional songs and musical performances",
    categoryId: 3
  },
  {
    id: "folk-dance",
    name: "Folk Dance",
    icon: Video,
    description: "Traditional dance performances and ceremonies",
    categoryId: 2
  },
  {
    id: "festivals",
    name: "Festivals",
    icon: Calendar,
    description: "Cultural celebrations and events",
    categoryId: 1
  },
  {
    id: "cuisine",
    name: "Cuisine",
    icon: Utensils,
    description: "Traditional food and recipes",
    categoryId: 5
  },
  {
    id: "folk-tales",
    name: "Folk Tales",
    icon: BookText,
    description: "Stories passed down through generations",
    categoryId: 13
  },
  {
    id: "folk-costumes",
    name: "Traditional Costumes",
    icon: Shirt,
    description: "Traditional dress and attire",
    categoryId: 6
  },
  {
    id: "folk-rituals",
    name: "Rituals",
    icon: Sparkles,
    description: "Sacred ceremonies and practices",
    categoryId: 7
  },
  {
    id: "folk-handicraft",
    name: "Handicrafts",
    icon: Hammer,
    description: "Traditional arts and crafts",
    categoryId: 8
  },
  {
    id: "books",
    name: "Books",
    icon: Book,
    description: "Published works about culture",
    categoryId: 17
  },
  {
    id: "scripts",
    name: "Scripts",
    icon: ScrollText,
    description: "Traditional writing systems",
    categoryId: 18
  },
  {
    id: "languages",
    name: "Languages",
    icon: Languages,
    description: "Indigenous languages and dialects",
    categoryId: 19
  },
];

const UploadContent = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleTypeSelect = (typeId: string) => {
    const selectedContent = contentTypes.find(type => type.id === typeId);
    if (selectedContent) {
      setSelectedType(typeId);
      navigate(`/upload/${selectedContent.categoryId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FFFF]">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="text-[#165263]" />
        </button>
        <h1 className="text-[#165263] text-lg font-medium">
          <TranslatableText text="Upload Content" />
        </h1>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#165263] mb-2">
            <TranslatableText text="Select Content Type" />
          </h2>
          <p className="text-gray-600">
            <TranslatableText text="Choose the type of content you want to upload" />
          </p>
        </div>

        {/* Content Type Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100 text-left"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#165263]/10 to-[#5DA9B7]/10 group-hover:from-[#165263] group-hover:to-[#5DA9B7] transition-all">
                    <Icon className="h-6 w-6 text-[#165263] group-hover:text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#165263] group-hover:text-[#5DA9B7]">
                    <TranslatableText text={type.name} />
                  </h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  <TranslatableText text={type.description} />
                </p>
                <div className="flex items-center gap-2 text-[#5DA9B7]">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    <TranslatableText text="Start Upload" />
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default UploadContent;
import React, { useState, useEffect, useRef } from "react";
import {
  Loader2,
  Plus,
  X,
  ChevronDown,
  Upload,
  Video,
  Youtube,
  Calendar,
} from "lucide-react";

// VideoInput Component
export const VideoInput = ({ value = {}, setValue, attribute }) => {
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const thumbnailInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const updateVideo = (field, newValue) => {
    const newData = {
      ...value,
      [field]: newValue,
      updated_at: new Date().toISOString(),
    };
    setValue(newData);
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : null;
  };

  const handleThumbnailUpload = async (file) => {
    setUploadingThumbnail(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("https://arabhaya2.bidabhadohi.com/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) updateVideo("thumbnail_path", data.fileUrl);
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleVideoUpload = async (file) => {
    setUploadingVideo(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("https://arabhaya2.bidabhadohi.com/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) updateVideo("file_path", data.fileUrl);
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setUploadingVideo(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
        <div className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title{" "}
                {attribute.is_required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  ""
                )}
              </label>
              <input
                type="text"
                value={value.title || ""}
                onChange={(e) => updateVideo("title", e.target.value)}
                placeholder="Enter title"
                required={attribute.is_required}
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description{" "}
                {attribute.is_required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  ""
                )}
              </label>
              <input
                type="text"
                value={value.description || ""}
                onChange={(e) => updateVideo("description", e.target.value)}
                placeholder="Enter description"
                required={attribute.is_required}
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail Image{" "}
              {attribute.is_required ? (
                <span className="text-red-500">*</span>
              ) : (
                ""
              )}
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-[10px] p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => thumbnailInputRef.current?.click()}
            >
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleThumbnailUpload(file);
                }}
              />
              {uploadingThumbnail ? (
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              ) : value.thumbnail_path ? (
                <div className="relative w-full">
                  <img
                    src={value.thumbnail_path}
                    alt="Thumbnail"
                    className="w-full h-60 object-cover rounded-[5px]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-[5px]">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Upload Thumbnail</p>
                  <p className="text-xs text-gray-500">
                    16:9 aspect ratio recommended
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Source{" "}
              {attribute.is_required ? (
                <span className="text-red-500">*</span>
              ) : (
                ""
              )}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-[10px] overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-300">
                <div
                  className="p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleVideoUpload(file);
                    }}
                  />
                  {uploadingVideo ? (
                    <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Video className="h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Upload Video</p>
                      <p className="text-xs text-gray-500">
                        MP4, WebM up to 100MB
                      </p>
                    </>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Youtube className="h-5 w-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-700">
                      YouTube URL
                    </label>
                  </div>
                  <input
                    type="text"
                    value={value.file_path || ""}
                    onChange={(e) =>
                      updateVideo(
                        "file_path",
                        getYouTubeEmbedUrl(e.target.value)
                      )
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                    required={attribute.is_required && !value.file_path}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>
            {value.file_path && (
              <div className="aspect-video rounded-[10px] overflow-hidden bg-black">
                {value.file_path.includes("www.youtube.com/embed") ? (
                  <iframe
                    src={value.file_path}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    src={value.file_path}
                    controls
                    className="w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// AudioInput Component
export const AudioInput = ({ value = {}, setValue, attribute }) => {
  const [uploadingStatus, setUploadingStatus] = useState({
    audio: false,
    thumbnail: false,
  });

  const updateAudio = (field, newValue) => {
    const newData = { ...value };
    if (["genre", "performers", "instruments"].includes(field)) {
      newData[field] = newValue.split(",").map((item) => item.trim());
    } else {
      newData[field] = newValue;
    }
    setValue(newData);
  };

  const handleAudioFileUpload = async (file) => {
    setUploadingStatus((prev) => ({ ...prev, audio: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("https://arabhaya2.bidabhadohi.com/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) updateAudio("file_path", data.fileUrl);
    } catch (error) {
      console.error("Error uploading audio file:", error);
      alert("Failed to upload audio file");
    } finally {
      setUploadingStatus((prev) => ({ ...prev, audio: false }));
    }
  };

  const handleThumbnailUpload = async (file) => {
    setUploadingStatus((prev) => ({ ...prev, thumbnail: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("https://arabhaya2.bidabhadohi.com/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) updateAudio("thumbnail_path", data.fileUrl);
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      alert("Failed to upload thumbnail");
    } finally {
      setUploadingStatus((prev) => ({ ...prev, thumbnail: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
        <div className="p-4 grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title{" "}
                {attribute.is_required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  ""
                )}
              </label>
              <input
                type="text"
                value={value.title || ""}
                onChange={(e) => updateAudio("title", e.target.value)}
                placeholder="Enter title"
                required={attribute.is_required}
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description{" "}
                {attribute.is_required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  ""
                )}
              </label>
              <input
                type="text"
                value={value.description || ""}
                onChange={(e) => updateAudio("description", e.target.value)}
                placeholder="Enter description"
                required={attribute.is_required}
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audio File{" "}
              {attribute.is_required ? (
                <span className="text-red-500">*</span>
              ) : (
                ""
              )}
            </label>
            {uploadingStatus.audio ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                <span>Uploading audio...</span>
              </div>
            ) : value.file_path ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {value.file_path.split("/").pop()}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("audio-file-input").click()
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  document.getElementById("audio-file-input").click()
                }
                className="px-4 py-2 border border-gray-300 rounded-[5px] text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Upload Audio File
              </button>
            )}
            <input
              id="audio-file-input"
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAudioFileUpload(file);
              }}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail Image{" "}
              {attribute.is_required ? (
                <span className="text-red-500">*</span>
              ) : (
                ""
              )}
            </label>
            {uploadingStatus.thumbnail ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                <span>Uploading thumbnail...</span>
              </div>
            ) : value.thumbnail_path ? (
              <div className="space-y-2">
                <img
                  src={value.thumbnail_path}
                  alt="Thumbnail"
                  className="w-32 h-32 object-cover rounded-[5px]"
                />
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("thumbnail-input").click()
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Change Thumbnail
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  document.getElementById("thumbnail-input").click()
                }
                className="px-4 py-2 border border-gray-300 rounded-[5px] text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Upload Thumbnail
              </button>
            )}
            <input
              id="thumbnail-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleThumbnailUpload(file);
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lyrics{" "}
                {attribute.is_required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  ""
                )}
              </label>
              <input
                type="text"
                value={value.lyrics || ""}
                onChange={(e) => updateAudio("lyrics", e.target.value)}
                placeholder="Enter lyrics"
                required={attribute.is_required}
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre (comma-separated){" "}
                {attribute.is_required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  ""
                )}
              </label>
              <input
                type="text"
                value={value.genre?.join(", ") || ""}
                onChange={(e) => updateAudio("genre", e.target.value)}
                placeholder="Enter genres (e.g., Rock, Jazz)"
                required={attribute.is_required}
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Composer{" "}
                {attribute.is_required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  ""
                )}
              </label>
              <input
                type="text"
                value={value.composer || ""}
                onChange={(e) => updateAudio("composer", e.target.value)}
                placeholder="Enter composer name"
                required={attribute.is_required}
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Performers (comma-separated){" "}
                {attribute.is_required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  ""
                )}
              </label>
              <input
                type="text"
                value={value.performers?.join(", ") || ""}
                onChange={(e) => updateAudio("performers", e.target.value)}
                placeholder="Enter performers"
                required={attribute.is_required}
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instruments (comma-separated){" "}
                {attribute.is_required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  ""
                )}
              </label>
              <input
                type="text"
                value={value.instruments?.join(", ") || ""}
                onChange={(e) => updateAudio("instruments", e.target.value)}
                placeholder="Enter instruments"
                required={attribute.is_required}
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// DocumentInput Component
export const DocumentInput = ({ value = {}, setValue, attribute }) => {
  const updateDocument = (field, newValue) => {
    const newData = {
      ...value,
      [field]: newValue,
      updated_at: new Date().toISOString(),
    };
    setValue(newData);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
        <div className="p-4 grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title{" "}
                {attribute.is_required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  ""
                )}
              </label>
              <input
                type="text"
                value={value.title || ""}
                onChange={(e) => updateDocument("title", e.target.value)}
                placeholder="Enter title"
                required={attribute.is_required}
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description{" "}
                {attribute.is_required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  ""
                )}
              </label>
              <input
                type="text"
                value={value.description || ""}
                onChange={(e) => updateDocument("description", e.target.value)}
                placeholder="Enter description"
                required={attribute.is_required}
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Path{" "}
                {attribute.is_required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  ""
                )}
              </label>
              <input
                type="text"
                value={value.file_path || ""}
                onChange={(e) => updateDocument("file_path", e.target.value)}
                placeholder="Enter file path"
                required={attribute.is_required}
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail Path{" "}
                {attribute.is_required ? (
                  <span className="text-red-500">*</span>
                ) : (
                  ""
                )}
              </label>
              <input
                type="text"
                value={value.thumbnail_path || ""}
                onChange={(e) =>
                  updateDocument("thumbnail_path", e.target.value)
                }
                placeholder="Enter thumbnail path"
                required={attribute.is_required}
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ImageInput Component (Limited to 1 Entry)
export const ImageInput = ({ value = {}, setValue }) => {
  const updateImage = (field, newValue) => {
    const newData = {
      ...value,
      [field]: newValue,
      updated_at: new Date().toISOString(),
    };
    setValue(newData);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
        <div className="p-4 grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={value.title || ""}
                onChange={(e) => updateImage("title", e.target.value)}
                placeholder="Enter title"
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={value.description || ""}
                onChange={(e) => updateImage("description", e.target.value)}
                placeholder="Enter description"
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File Path
              </label>
              <input
                type="text"
                value={value.file_path || ""}
                onChange={(e) => updateImage("file_path", e.target.value)}
                placeholder="Enter file path"
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MIME Type
              </label>
              <input
                type="text"
                value={value.mime_type || ""}
                onChange={(e) => updateImage("mime_type", e.target.value)}
                placeholder="Enter MIME type (e.g., image/jpeg)"
                className="w-full px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// TribeInput Component (Limited to 1 Entry)
export const TribeInput = ({ value = {}, setValue }) => {
  const [tribes, setTribes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  useEffect(() => {
    fetch("https://arabhaya2.bidabhadohi.com/api/tribe/get-tribes")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTribes(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tribes:", error);
        setLoading(false);
      });
  }, []);

  const updateTribeAssociation = (tribeId) => {
    const selectedTribe = tribes.find(
      (tribe) => tribe.id?.toString() === tribeId.toString()
    );
    if (selectedTribe) {
      setValue({
        associated_table: "tribes",
        associated_table_id: selectedTribe.id,
        name: selectedTribe.name,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 text-gray-500">
        <Loader2 className="animate-spin h-5 w-5 mr-2" />
        Loading tribes...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden">
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Tribe
          </label>
          <div className="relative">
            <button
              type="button"
              className="w-full bg-white border border-gray-300 rounded-[5px] px-4 py-2 text-left text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              onClick={() => setIsSelectOpen(!isSelectOpen)}
            >
              <div className="flex items-center justify-between">
                <span>
                  {tribes.find(
                    (tribe) =>
                      tribe.id?.toString() ===
                      value.associated_table_id?.toString()
                  )?.name || "Select a tribe"}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform ${isSelectOpen ? "transform rotate-180" : ""}`}
                />
              </div>
            </button>
            {isSelectOpen && (
              <div className="z-10 w-full mt-1 bg-white border border-gray-200 rounded-[5px] shadow-lg">
                <div className="py-1 max-h-60 overflow-auto">
                  {tribes
                    .filter((tribe) => tribe.id != null)
                    .map((tribe) => (
                      <button
                        key={tribe.id}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        onClick={() => {
                          updateTribeAssociation(tribe.id.toString());
                          setIsSelectOpen(false);
                        }}
                      >
                        {tribe.name}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ArrayInput Component (Unchanged, for string arrays)
const ArrayInput = ({ value = [], setValue }) => {
  return (
    <div className="space-y-3">
      {value.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const newValue = [...value];
              newValue[index] = e.target.value;
              setValue(newValue);
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          <button
            onClick={() => {
              const newValue = [...value];
              newValue.splice(index, 1);
              setValue(newValue);
            }}
            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-red-600 bg-red-50 hover:bg-red-100 rounded-[5px] text-sm font-medium transition-colors"
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          setValue([...value, ""]);
        }}
        className="w-full py-2.5 px-4 border border-blue-300 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-[10px] text-sm font-medium transition-colors flex items-center justify-center"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Item
      </button>
    </div>
  );
};

// ThumbnailImageInput Component (Updated for file upload)
const ThumbnailImageInput = ({ value = "", setValue }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("https://arabhaya2.bidabhadohi.com/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setValue(data.fileUrl); // Set the uploaded image URL
      } else {
        console.error("Upload failed:", data.message);
        alert("Failed to upload image");
      }
    } catch (error) {

      console.log("here is the error", error)
      console.error("Error uploading image:", error);
      // alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2">
      <div
        className="border-2 border-dashed border-gray-300 rounded-[10px] p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
        />
        {uploading ? (
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        ) : value ? (
          <div className="relative w-full max-w-xs">
            <img
              src={value}
              alt="Thumbnail"
              className="w-full h-40 object-cover rounded-[5px]"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-[5px]">
              <Upload className="h-8 w-8 text-white" />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Upload Thumbnail Image</p>
            <p className="text-xs text-gray-500">JPG, PNG, GIF up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
};
// Handle date picker change for "cat-Festivals-DateOfCelebration"
const handleDateChangeForFestivals = (e, setAttributeValues, attributeId) => {
  const date = new Date(e.target.value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const formattedDate = `${day}-${month}`;

  setAttributeValues((prev) => ({
    ...prev,
    [attributeId]: { value: formattedDate },
  }));
};

// RenderAttributes Component
const RenderAttributes = ({
  attribute,
  attributeValues,
  setAttributeValues,
  attributeTypes,
}) => {
  const defaultValues = {
    6: { associated_table: "tribes", associated_table_id: "", name: "" },
    8: {
      title: "",
      description: "",
      file_path: "",
      thumbnail_path: "",
      lyrics: "",
      genre: [],
      composer: "",
      performers: [],
      instruments: [],
      mime_type: "audio",
      created_by: 1,
    },
    9: {
      title: "",
      file_path: "",
      mime_type: "video",
      description: "",
      thumbnail_path: "",
      created_by: 1,
    },
    10: {
      title: "",
      file_path: "",
      mime_type: "",
      description: "",
      thumbnail_path: "",
      created_by: 1,
    },
    11: {
      title: "",
      file_path: "",
      mime_type: "",
      media_type: "image",
      description: "",
      created_by: 1,
    },
  };

  const isThumbnailAttribute =
    attribute.name.toLowerCase().includes("thumbnail") ||
    attribute.name.toLowerCase().includes("image");
  if (isThumbnailAttribute) {
    return (
      <ThumbnailImageInput
        value={attributeValues[attribute.id]?.value || ""}
        setValue={(newValue) =>
          setAttributeValues((prev) => ({
            ...prev,
            [attribute.id]: { value: newValue },
          }))
        }
      />
    );
  }

  if (attribute.name === "cat-Festivals-DateOfCelebration") {
    return (
      <div className="mt-2">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={
              attributeValues[attribute.id]?.value
                ? (() => {
                    const [day, month] =
                      attributeValues[attribute.id].value.split("-");
                    const year = new Date().getFullYear();
                    return `${year}-${month}-${day}`;
                  })()
                : ""
            }
            onChange={(e) =>
              handleDateChangeForFestivals(e, setAttributeValues, attribute.id)
            }
            required={attribute.is_required}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
          />
          {attributeValues[attribute.id]?.value && (
            <p className="text-sm text-gray-500 mt-1">
              Selected: {attributeValues[attribute.id].value}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (attribute.attribute_type_id === 6) {
    return (
      <div className="mt-2">
        <TribeInput
          value={attributeValues[attribute.id]?.value || defaultValues[6]}
          setValue={(newValue) =>
            setAttributeValues((prev) => ({
              ...prev,
              [attribute.id]: { value: newValue },
            }))
          }
        />
      </div>
    );
  }

  if (attribute.attribute_type_id === 1) {
    return (
      <input
        type="text"
        value={attributeValues[attribute.id]?.value || ""}
        onChange={(e) =>
          setAttributeValues((prev) => ({
            ...prev,
            [attribute.id]: { value: e.target.value },
          }))
        }
        placeholder={attribute.description}
        required={attribute.is_required}
        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      />
    );
  }

  if (attribute.attribute_type_id === 2) {
    return (
      <div className="mt-2">
        <ArrayInput
          value={attributeValues[attribute.id]?.value || []}
          setValue={(newValue) =>
            setAttributeValues((prev) => ({
              ...prev,
              [attribute.id]: { value: newValue },
            }))
          }
        />
      </div>
    );
  }

  if (attribute.attribute_type_id === 8) {
    return (
      <div className="mt-2">
        <AudioInput
          value={attributeValues[attribute.id]?.value || defaultValues[8]}
          setValue={(newValue) =>
            setAttributeValues((prev) => ({
              ...prev,
              [attribute.id]: { value: newValue },
            }))
          }
          attribute={attribute}
        />
      </div>
    );
  }

  if (attribute.attribute_type_id === 9) {
    return (
      <div className="mt-2">
        <VideoInput
          value={attributeValues[attribute.id]?.value || defaultValues[9]}
          setValue={(newValue) =>
            setAttributeValues((prev) => ({
              ...prev,
              [attribute.id]: { value: newValue },
            }))
          }
          attribute={attribute}
        />
      </div>
    );
  }

  if (attribute.attribute_type_id === 10) {
    return (
      <div className="mt-2">
        <DocumentInput
          value={attributeValues[attribute.id]?.value || defaultValues[10]}
          setValue={(newValue) =>
            setAttributeValues((prev) => ({
              ...prev,
              [attribute.id]: { value: newValue },
            }))
          }
          attribute={attribute}
        />
      </div>
    );
  }

  if (attribute.attribute_type_id === 11) {
    return (
      <div className="mt-2">
        <ImageInput
          value={attributeValues[attribute.id]?.value || defaultValues[11]}
          setValue={(newValue) =>
            setAttributeValues((prev) => ({
              ...prev,
              [attribute.id]: { value: newValue },
            }))
          }
        />
      </div>
    );
  }

  return (
    <input
      type="text"
      value={attributeValues[attribute.id]?.value || ""}
      onChange={(e) =>
        setAttributeValues((prev) => ({
          ...prev,
          [attribute.id]: { value: e.target.value },
        }))
      }
      placeholder={attribute.description}
      required={attribute.is_required}
      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-[5px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
    />
  );
};

export default RenderAttributes;

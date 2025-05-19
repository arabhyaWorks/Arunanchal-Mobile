import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Music2,
  Clock,
  Info,
  X,
  Calendar,
  ChevronLeft,
} from 'lucide-react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { TranslatableText } from '../components/TranslatableText';

// Static genres array
const genres = [
  "Ballad",
  "Lullaby", 
  "Wedding Song",
  "Harvest Song",
  "Festival Song",
  "Prayer Song",
  "Other"
];

const FolkMusicUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const cropperRef = useRef<any>(null);

  // State for tribes and user
  const [tribes, setTribes] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropData, setCropData] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    tribe: "",
    variation: "",
    composer: "",
    genre: "",
    duration: "",
    instruments: "",
    region: "",
    significance: "",
    historicalContext: "",
    description: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState({
    thumbnail: null,
    audio: null,
  });

  // Load user from localStorage and fetch tribes
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing userData:', error);
        localStorage.removeItem('userData');
      }
    }

    const fetchTribes = async () => {
      try {
        const response = await fetch('https://arabhaya2.bidabhadohi.com/api/tribe');
        const data = await response.json();
        if (data.success) {
          setTribes(data.data);
        }
      } catch (error) {
        console.error('Error fetching tribes:', error);
      }
    };

    fetchTribes();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please upload an image file'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCropData = () => {
    if (cropperRef.current?.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      setCropData(croppedCanvas.toDataURL());
      setShowCropper(false);
      
      // Convert cropped data to file
      croppedCanvas.toBlob(async (blob: Blob) => {
        if (blob) {
          const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
          await uploadFile(file, 'thumbnail');
        }
      });
    }
  };

  const uploadFile = async (file: File, type: 'thumbnail' | 'audio') => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://arabhaya2.bidabhadohi.com/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setUploadedFiles(prev => ({
          ...prev,
          [type]: data.fileUrl
        }));
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrors(prev => ({
        ...prev,
        [type]: 'Failed to upload file'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/m4a'];
      
      if (!validAudioTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          audio: 'Please upload a valid audio file (MP3, WAV, OGG, AAC, or M4A)'
        }));
        return;
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          audio: 'Audio file must be less than 10MB'
        }));
        return;
      }

      setAudioFile(file);
      await uploadFile(file, 'audio');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!uploadedFiles.thumbnail) newErrors.image = 'Thumbnail image is required';
    if (!uploadedFiles.audio) newErrors.audio = 'Audio file is required';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.tribe) newErrors.tribe = 'Tribe is required';
    if (!formData.genre) newErrors.genre = 'Genre is required';
    if (!formData.duration) newErrors.duration = 'Duration is required';
    if (!user?.id) newErrors.submit = 'User authentication required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedTribe = tribes.find((t: any) => t.id.toString() === formData.tribe);

    const payload = {
      category_id: 3,
      name: formData.title,
      description: formData.description,
      user_id: user.id,
      attributes: [
        {
          attribute_id: 34,
          attribute_name: "cat-FolkMusic-Tribe",
          attribute_type_id: 6,
          attribute_value: {
            value: [{
              associated_table: 'tribes',
              associated_table_id: Number(formData.tribe),
              name: selectedTribe?.name || ''
            }]
          }
        },
        {
          attribute_id: 35,
          attribute_name: "cat-FolkMusic-Variation",
          attribute_type_id: 1,
          attribute_value: { value: formData.variation }
        },
        {
          attribute_id: 36,
          attribute_name: "cat-FolkMusic-Genere",
          attribute_type_id: 1,
          attribute_value: { value: formData.genre }
        },
        {
          attribute_id: 37,
          attribute_name: "cat-FolkMusic-DurationOfTheMusic",
          attribute_type_id: 1,
          attribute_value: { value: formData.duration }
        },
        {
          attribute_id: 38,
          attribute_name: "cat-FolkMusic-Composer/Artist/Performer",
          attribute_type_id: 1,
          attribute_value: { value: formData.composer }
        },
        {
          attribute_id: 40,
          attribute_name: "cat-FolkMusic-RegionOrCulturalOrigin",
          attribute_type_id: 1,
          attribute_value: { value: formData.region }
        },
        {
          attribute_id: 41,
          attribute_name: "cat-FolkMusic-SocialOrCulturalSignificance",
          attribute_type_id: 1,
          attribute_value: { value: formData.significance }
        },
        {
          attribute_id: 42,
          attribute_name: "cat-FolkMusic-Historical/religiousContextAndSignificance",
          attribute_type_id: 1,
          attribute_value: { value: formData.historicalContext }
        },
        {
          attribute_id: 43,
          attribute_name: "cat-FolkMusic-FolkMusic",
          attribute_type_id: 8,
          attribute_value: {
            value: [{
              title: formData.title,
              description: formData.description,
              file_path: uploadedFiles.audio,
              thumbnail_path: uploadedFiles.thumbnail,
              lyrics: "",
              genre: [formData.genre],
              composer: formData.composer,
              performers: formData.composer.split(',').map(p => p.trim()),
              instruments: formData.instruments.split(',').map(i => i.trim()),
              mime_type: "audio",
              created_by: user.id
            }]
          }
        }
      ]
    };

    setIsUploading(true);
    try {
      const response = await fetch('https://arabhaya2.bidabhadohi.com/api/category/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        navigate('/my-content');
      } else {
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to create folk music entry'
        }));
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit form'
      }));
    } finally {
      setIsUploading(false);
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
          <TranslatableText text="Upload Folk Music" />
        </h1>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#165263]">
              <TranslatableText text="Thumbnail Image" /> <span className="text-red-500">*</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-square w-48 rounded-xl border-2 border-dashed ${
                errors.image
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-[#5DA9B7]'
              } transition-colors cursor-pointer group`}
            >
              {cropData ? (
                <>
                  <img
                    src={cropData}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCropData(null);
                      setUploadedFiles(prev => ({ ...prev, thumbnail: null }));
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-[#5DA9B7] border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-sm text-gray-500">
                        <TranslatableText text="Uploading..." />
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center px-4">
                        <TranslatableText text="Upload Thumbnail" />
                        <span className="block text-xs mt-1">
                          <TranslatableText text="1:1 aspect ratio recommended" />
                        </span>
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image}</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Image Cropper Modal */}
          {showCropper && imagePreview && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
                <h3 className="text-lg font-semibold text-[#165263] mb-4">
                  <TranslatableText text="Crop Image" />
                </h3>
                <div className="mb-4">
                  <Cropper
                    ref={cropperRef}
                    src={imagePreview}
                    style={{ height: 400, width: '100%' }}
                    aspectRatio={1}
                    guides={true}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCropper(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <TranslatableText text="Cancel" />
                  </button>
                  <button
                    type="button"
                    onClick={getCropData}
                    className="px-4 py-2 bg-[#165263] text-white rounded-lg hover:bg-[#0D3D4D]"
                  >
                    <TranslatableText text="Crop & Upload" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Audio Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#165263]">
              <TranslatableText text="Audio File" /> <span className="text-red-500">*</span>
            </label>
            <div
              onClick={() => audioInputRef.current?.click()}
              className={`relative p-4 rounded-xl border-2 border-dashed ${
                errors.audio
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-[#5DA9B7]'
              } transition-colors cursor-pointer`}
            >
              <div className="flex items-center gap-4">
                <Music2 className="h-8 w-8 text-gray-400" />
                <div className="flex-1">
                  {audioFile ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#165263]">{audioFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAudioFile(null);
                          setUploadedFiles(prev => ({ ...prev, audio: null }));
                          if (audioInputRef.current) audioInputRef.current.value = '';
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      {isUploading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-[#5DA9B7] border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-sm text-gray-500">
                            <TranslatableText text="Uploading..." />
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-gray-500">
                            <TranslatableText text="Click to upload audio file" />
                          </p>
                          <p className="text-xs text-gray-400">
                            <TranslatableText text="MP3, WAV up to 10MB" />
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {errors.audio && (
              <p className="text-sm text-red-500">{errors.audio}</p>
            )}
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="hidden"
            />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#165263] mb-1">
                <TranslatableText text="Title" /> <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                placeholder="Enter music title"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Tribe */}
            <div>
              <label className="block text-sm font-medium text-[#165263] mb-1">
                <TranslatableText text="Tribe" /> <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.tribe}
                onChange={(e) => setFormData({ ...formData, tribe: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
              >
                <option value="">Select tribe</option>
                {tribes.map((tribe: any) => (
                  <option key={tribe.id} value={tribe.id}>
                    {tribe.name}
                  </option>
                ))}
              </select>
              {errors.tribe && (
                <p className="text-sm text-red-500 mt-1">{errors.tribe}</p>
              )}
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-[#165263] mb-1">
                <TranslatableText text="Genre" /> <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
              >
                <option value="">Select genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
              {errors.genre && (
                <p className="text-sm text-red-500 mt-1">{errors.genre}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-[#165263] mb-1">
                <TranslatableText text="Duration" /> <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                  placeholder="e.g., 4:30"
                />
              </div>
              {errors.duration && (
                <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
              )}
            </div>

            {/* Other Fields */}
            <div>
              <label className="block text-sm font-medium text-[#165263] mb-1">
                <TranslatableText text="Variation" />
              </label>
              <input
                type="text"
                value={formData.variation}
                onChange={(e) => setFormData({ ...formData, variation: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                placeholder="Enter variation if any"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#165263] mb-1">
                <TranslatableText text="Composer/Artist/Performer" />
              </label>
              <input
                type="text"
                value={formData.composer}
                onChange={(e) => setFormData({ ...formData, composer: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                placeholder="Enter composer or performer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#165263] mb-1">
                <TranslatableText text="Instruments Used" />
              </label>
              <input
                type="text"
                value={formData.instruments}
                onChange={(e) => setFormData({ ...formData, instruments: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                placeholder="Enter instruments (comma-separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#165263] mb-1">
                <TranslatableText text="Region/Cultural Origin" />
              </label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                placeholder="Enter region or cultural origin"
              />
            </div>
          </div>

          {/* Text Areas */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#165263] mb-1">
                <TranslatableText text="Description" />
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                placeholder="Write the description for the music"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#165263] mb-1">
                <TranslatableText text="Social or Cultural Significance" />
              </label>
              <textarea
                value={formData.significance}
                onChange={(e) => setFormData({ ...formData, significance: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                placeholder="Describe the social or cultural significance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#165263] mb-1">
                <TranslatableText text="Historical/Religious Context" />
              </label>
              <textarea
                value={formData.historicalContext}
                onChange={(e) => setFormData({ ...formData, historicalContext: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#5DA9B7] focus:border-[#5DA9B7]"
                placeholder="Describe the historical or religious context"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <TranslatableText text="Cancel" />
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className={`px-6 py-2 bg-[#165263] text-white rounded-lg hover:bg-[#0D3D4D] transition-colors flex items-center gap-2 ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <TranslatableText text="Uploading..." />
                </>
              ) : (
                <TranslatableText text="Upload Music" />
              )}
            </button>
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500 text-center mt-4">{errors.submit}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FolkMusicUpload;
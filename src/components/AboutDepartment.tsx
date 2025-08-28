import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Globe,
  Mail,
  Building,
  Users,
  Play,
  PartyPopper,
} from "lucide-react";
import Aboutimg from '../components/aboutimg.jpg'


interface AboutDepartmentProps {
  onBack?: () => void;
}

const AboutDepartmentScreen = ({ onBack }: AboutDepartmentProps) => {
  const navigate = useNavigate();

  const objectives = [
    "Safeguard and promote the indigenous cultures, traditions, and languages of Arunachal Pradesh.",
    "Document oral histories, customary laws, folk song, folklore, and traditional ecological knowledge.",
    "Support cultural institutions, community festivals, and indigenous art forms.",
    "Facilitate research and awareness about tribal identity and heritage.",
  ];

  const keyFunctions = [
    "Documentation and archiving of indigenous practices and traditions.",
    "Promotion of indigenous languages and dialects.",
    "Support for tribal customary laws and traditional village institutions and prayer system.",
    "Organizing cultural exchange programs, festivals, and exhibitions.",
    "Providing grants and support for indigenous scholars and cultural custodians.",
    "Liaising with national and international bodies on indigenous affairs.",
  ];

  const majorInitiatives = [
    {
      title: "Grant of Priest Honorarium",
      description:
        "The Government is extending Priest Honorarium to 3333 registered indigenous priests",
    },
    {
      title: "Construction of Prayer Centre",
      description:
        "The Department is extending financial assistance for construction indigenous prayer centres",
    },
    {
      title: "Indigenous Knowledge Documentation Program",
      description:
        "Recording traditional knowledge related to folk song, folklores, music, cuisine medicine, agriculture, and crafts.",
    },
    {
      title: "Cultural Heritage Centres",
      description:
        "Documentation of tangible and intangible, establishment of Gurukul schools /Tribal Cultural Centres, Archives, museums to showcase tribal culture and traditions.",
    },
    {
      title: "Language Preservation Projects",
      description:
        "Efforts to document and revive endangered tribal languages.",
    },
    {
      title: "Support for Local Festivals",
      description:
        "Financial grant extended for celebration of Indigenous traditional festivals like Mopin, Solung, Losar, Nyokum, Dree etc.",
    },
  ];

  const leadership = [
    {
      name: "Shri Mama Natung",
      position: "Hon'ble Minister",
      department: "Department of Indigenous Affairs",
      initial: "M",
    },
    {
      name: "Shri Pige Ligu, IAS",
      position: "Secretary",
      department: "Department of Indigenous Affairs",
      initial: "P",
    },
    {
      name: "Shri Sokhep Kri",
      position: "Director",
      department: "Department of Indigenous Affairs",
      initial: "S",
    },
    {
      name: "Shri Tao Takar",
      position: "Deputy Director",
      department: "Department of Indigenous Affairs",
      initial: "T",
    },
    {
      name: "Shri Lei Khandu",
      position: "Finance and Account Officer",
      department: "Department of Indigenous Affairs",
      initial: "L",
    },
    {
      name: "Shri Tapun Taki",
      position: "Assistant Director",
      department: "Department of Indigenous Affairs",
      initial: "T",
    },
    {
      name: "Shri Fecha Lamgu",
      position: "Assistant Research Officer",
      department: "Department of Indigenous Affairs",
      initial: "F",
    },
  ];

  // Unified back handler with safe fallback
  const handleBack = () => {
    if (onBack) return onBack();

    const canGoBack =
      typeof window !== "undefined" &&
      window.history &&
      (window.history.state?.idx ?? 0) > 0;

    if (canGoBack) {
      navigate(-1);
    } else {
      navigate("/"); // change to your preferred fallback route
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner with Image and Navigation */}
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <img
          src={Aboutimg}
          alt="Department Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        {/* Navigation Button on Image */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={handleBack}
            aria-label="Go back"
            className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center">
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white leading-tight">
            Department of Indigenous Affairs, Arunachal Pradesh – At a Glance
          </h2>
        </div>
      </div>

      {/* Content Container with Mobile-First Design */}
      <div className="px-4 py-6 space-y-6">
        {/* Overview Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Overview
            </h3>
          </div>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            The Department of Indigenous Affairs (DIA), Government of Arunachal
            Pradesh was created in 2017-18 and start functioning from 2018-19
            for the preservation, promotion, and documentation of the rich
            cultural heritage, traditions, and indigenous knowledge systems of
            the diverse tribal communities of the state.
          </p>
        </div>

        {/* Objectives */}
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Objectives
            </h3>
          </div>
          <div className="space-y-4">
            {objectives.map((objective, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    index % 2 === 0 ? "bg-blue-500" : "bg-teal-500"
                  } mt-2 flex-shrink-0`}
                />
                <span className="text-sm sm:text-base text-gray-700">
                  {objective}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Functions */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-purple-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Key Functions
            </h3>
          </div>
          <div className="space-y-4">
            {keyFunctions.map((func, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    index % 2 === 0 ? "bg-purple-500" : "bg-pink-500"
                  } mt-2 flex-shrink-0`}
                />
                <span className="text-sm sm:text-base text-gray-700">
                  {func}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Major Initiatives */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-amber-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Major Initiatives
            </h3>
          </div>
          <div className="space-y-4">
            {majorInitiatives.map((initiative, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-md border border-amber-100"
              >
                <h4 className="font-bold text-amber-700 mb-2 text-sm sm:text-base">
                  {initiative.title}
                </h4>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                  {initiative.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tribal Diversity */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 shadow-lg border border-emerald-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-600 to-green-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Tribal Diversity
            </h3>
          </div>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
            Arunachal Pradesh is home to over 26 major tribes and more than 100
            sub-tribes, each with its own unique cultural identity. The
            Department of Indigenous Affairs plays a key role in maintaining
            this diversity through inclusive policies and targeted programs.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
                26+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">
                Major Tribes
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">
                100+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">
                Sub-tribes
              </div>
            </div>
          </div>
        </div>

        {/* Collaboration */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-indigo-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              Collaboration
            </h3>
          </div>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6">
            The Department works in collaboration with community-based
            organizations, research institutions, NGOs, and other government
            agencies to ensure the holistic development and empowerment of
            indigenous communities.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              "CBOs",
              "Research Institutions",
              "NGOs",
              "Government Agencies",
            ].map((tag, index) => (
              <span
                key={index}
                className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-medium text-center"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Who's Who Section - Mobile Optimized */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-6 text-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Who's Who
            </h2>
            <p className="text-blue-100 text-sm sm:text-base">
              Leadership and key personnel of the Department
            </p>
          </div>
          <div className="space-y-4">
            {leadership.map((leader, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 flex items-center justify-center text-lg sm:text-xl font-bold text-white flex-shrink-0">
                    {leader.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                      {leader.name}
                    </h3>
                    <p className="text-blue-200 text-sm font-medium">
                      {leader.position}
                    </p>
                    <p className="text-blue-300 text-xs">{leader.department}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information - Mobile Optimized */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 rounded-2xl p-6 text-white">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Contact Information
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-yellow-300 to-orange-300 mx-auto rounded-full" />
          </div>

          <div className="space-y-6">
            {/* Address Card */}
            <div className="bg-gradient-to-br from-white/15 to-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/30">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/40 to-white/25 flex items-center justify-center mb-4 mx-auto">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-4">Address</h3>
                <address className="not-italic text-sm sm:text-base space-y-1">
                  <div className="font-semibold text-yellow-200">
                    Department of Indigenous Affairs
                  </div>
                  <div className="text-white">Chimpu-Itanagar-791113</div>
                  <div className="text-white">District Papum Pare</div>
                  <div className="font-medium text-yellow-300 mt-2">
                    Arunachal Pradesh
                  </div>
                </address>
              </div>
            </div>

            {/* Digital Contact */}
            <div className="bg-gradient-to-br from-white/12 to-white/8 rounded-xl p-6 backdrop-blur-sm border border-white/25">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/35 to-white/25 flex items-center justify-center flex-shrink-0">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <a
                    href="https://indigenous.arunachal.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-100 hover:text-yellow-200 transition-colors text-sm sm:text-base font-medium break-all"
                  >
                    indigenous.arunachal.gov.in
                  </a>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/35 to-white/25 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <a
                    href="mailto:ap.indaff@gmail.com"
                    className="text-blue-100 hover:text-yellow-200 transition-colors text-sm sm:text-base font-medium break-all"
                  >
                    ap.indaff@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation Space */}
        <div className="h-2" />
      </div>
    </div>
  );
};

export default AboutDepartmentScreen;

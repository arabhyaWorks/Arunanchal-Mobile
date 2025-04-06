import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supportedLanguages } from '../contexts/LanguageContext';
import { TranslatableText } from '../components/TranslatableText';

const Header = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm py-3 px-4 md:px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <img 
            src="https://arunachal.upstateagro.com/logo_ap.png" 
            alt="Logo" 
            className="h-10 w-10 md:h-12 md:w-12 object-contain"
          />
          <div className="flex flex-col">
            <h1 className="text-[#165263] text-base md:text-lg font-medium">
              <TranslatableText text="Department of Indigenous Affairs" />
            </h1>
            <p className="text-[#5DA9B7] text-base md:text-lg font-medium">
              <TranslatableText text="Government of Arunachal Pradesh" />
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
        >
          <Languages size={24} className="text-[#165263]" />
          <span className="text-[#165263] font-medium hidden md:block">
            {supportedLanguages.find(lang => lang.code === currentLanguage)?.name}
          </span>
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-auto">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-[#165263] text-xl font-semibold">
                  <TranslatableText text="Select Language" />
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-[#165263]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {supportedLanguages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setLanguage(language.code);
                        setIsModalOpen(false);
                      }}
                      className={`p-3 rounded-lg text-left transition-colors ${
                        currentLanguage === language.code
                          ? 'bg-[#165263] text-white'
                          : 'hover:bg-gray-50 text-[#165263]'
                      }`}
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full p-3 text-[#165263] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <TranslatableText text="Close" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
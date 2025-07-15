import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface Festival {
  id: number;
  name: string;
  description: string;
  tribe: string;
  date: string;
  month: string;
  duration: string;
  image: string;
  district: string;
}

const Festivals = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await fetch('https://arunachal.upstateagro.com/api/category/items?category_id=1');
        const data = await response.json();
        if (data?.data) {
          const transformedFestivals = data.data.map((festival: any) => {
            const dateStr = festival.attributes.find(
              (attr: any) => attr.attribute_name === 'cat-Festivals-DateOfCelebration'
            )?.attribute_value?.value || '';
            
            // Parse date string like "DD-MM" to a Date object
            const dateParts = dateStr.match(/(\d{2})-(\d{2})/);
            const date = dateParts 
              ? new Date(`${currentDate.getFullYear()}-${dateParts[2]}-${dateParts[1]}`)
              : new Date();

            return {
              id: festival.id,
              name: festival.name,
              description: festival.description,
              tribe: festival.attributes.find(
                (attr: any) => attr.attribute_name === 'cat-Festivals-Tribe'
              )?.attribute_value?.value?.[0]?.name || 'Unknown Tribe',
              date: dateStr ? `${dateParts[1]}-${dateParts[2]}` : 'Unknown Date',
              month: date.toLocaleString('default', { month: 'long' }),
              duration: festival.attributes.find(
                (attr: any) => attr.attribute_name === 'cat-Festivals-Duration'
              )?.attribute_value?.value || 'Duration not available',
              image: festival.attributes.find(
                (attr: any) => attr.attribute_name === 'cat-Festivals-ImagesOfTheFestivals'
              )?.attribute_value?.value || null,
              district: festival.attributes.find(
                (attr: any) => attr.attribute_name === 'cat-Festivals-Regions'
              )?.attribute_value?.value || 'Unknown Location',
            };
          });
          setFestivals(transformedFestivals);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching festivals:', error);
        setLoading(false);
      }
    };
    fetchFestivals();
  }, []);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const getDayFestivals = (day: number) => {
    return festivals.filter(festival => {
      // Parse date string like "DD-MM"
      const dateParts = festival.date.match(/(\d{2})-(\d{2})/);
      if (!dateParts) return false;
      
      const festivalDate = new Date(`${currentDate.getFullYear()}-${dateParts[2]}-${dateParts[1]}`);
      return (
        festivalDate.getDate() === day &&
        festivalDate.getMonth() === currentDate.getMonth() &&
        festivalDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0FFFF] flex items-center justify-center">
        <div className="w-full max-w-7xl px-4 space-y-6">
          {/* Calendar Shimmer */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-24 animate-shimmer rounded-t-2xl"></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className="aspect-square">
                    <div className="w-10 h-10 animate-shimmer rounded-full mx-auto"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Festivals List Shimmer */}
          <div className="space-y-4 mt-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-lg">
                <div className="flex gap-4">
                  <div className="w-20 h-20 animate-shimmer rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 animate-shimmer rounded-lg w-3/4"></div>
                    <div className="h-4 animate-shimmer rounded-lg w-1/2"></div>
                    <div className="h-4 animate-shimmer rounded-lg w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft className="text-[#165263]" />
            </Link>
            <h1 className="text-[#165263] text-xl font-semibold tracking-tight">Festivals</h1>
            <div className="w-6" /> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Calendar Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#165263] to-[#5DA9B7] p-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={previousMonth}
                className="w-10 h-10 flex items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-semibold text-white tracking-wide">{monthName} {year}</h2>
              <button 
                onClick={nextMonth}
                className="w-10 h-10 flex items-center justify-center rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-1 text-center text-[#5DA9B7] font-medium mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-2">{day}</div>
              ))}
            </div>          
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dayFestivals = getDayFestivals(day);
                const hasFestival = dayFestivals.length > 0;

                return (
                  <div
                    key={day}
                    className="aspect-square p-1 relative"
                  >
                    <div className={`
                      w-10 h-10 flex items-center justify-center rounded-full text-sm
                      ${hasFestival 
                        ? 'bg-yellow-400 text-[#165263] font-medium shadow-md' 
                        : 'text-[#165263] hover:bg-gray-100'}
                      transition-all cursor-pointer
                    `}>
                      {day}
                    </div>
                    {hasFestival && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Festivals List */}
        <div className="mt-8 grid gap-4">
          {festivals
            .filter(festival => {
              const dateParts = festival.date.match(/(\d{2})-(\d{2})/);
              if (!dateParts) return false;
              
              const festivalDate = new Date(`${currentDate.getFullYear()}-${dateParts[2]}-${dateParts[1]}`);
              return (
                festivalDate.getMonth() === currentDate.getMonth() &&
                festivalDate.getFullYear() === currentDate.getFullYear()
              );
            })
            .map(festival => (
              <Link
                to={`/festival/${festival.id}`}
                key={festival.id}
                className="block bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all border border-gray-100/50 hover:border-gray-200"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={festival.image || 'https://arunachal.upstateagro.com/logo_ap.png'}
                      alt={festival.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h3 className="text-lg font-semibold text-teal-800 mb-2">
                      {festival.name}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        <Clock className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                        {festival.date}{festival.duration ? ` • ${festival.duration}` : ''}
                      </p>
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        <MapPin className="h-5 w-5 flex-shrink-0 text-yellow-500" />
                        {festival.district}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Festivals;
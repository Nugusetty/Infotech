import React, { useState, useEffect } from 'react';
import { Company, Slot } from '../types';
import { User, Sparkles, Calendar, Clock, Loader2, X, MapPin, Globe, History, ExternalLink } from 'lucide-react';
import { generateCompanyInsight } from '../services/geminiService';

interface BookingCardProps {
  company: Company;
  onBook: (companyId: string, slotId: string, userName: string) => void;
  onClose: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ company, onBook, onClose }) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Reset local state when company changes
  useEffect(() => {
    setSelectedSlotId(null);
    setUserName('');
    setAiInsight(null);
    
    // Auto-load AI insight for "World Class" experience
    const loadInsight = async () => {
        setLoadingAi(true);
        const insight = await generateCompanyInsight(company.name, company.industry);
        setAiInsight(insight);
        setLoadingAi(false);
    };
    loadInsight();
  }, [company.id, company.name, company.industry]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlotId && userName.trim()) {
      onBook(company.id, selectedSlotId, userName);
      setSelectedSlotId(null);
      setUserName('');
    }
  };

  const availableSlotsCount = company.slots.filter(s => !s.isBooked).length;

  // Helper to ensure URL has protocol and no whitespace
  const getWebsiteUrl = (url: string) => {
    if (!url) return '#';
    const cleanUrl = url.trim();
    return cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
  };

  // Helper for Google Maps URL
  const getMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  return (
    <div className="glass-panel w-full max-w-4xl mx-auto mt-8 p-6 md:p-8 rounded-2xl shadow-2xl animate-fade-in transition-all relative">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start mb-6 pr-10">
        <div className="w-full">
          <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-2">{company.name}</h2>
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
             <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide">
              {company.industry}
            </span>
             <span className="text-sm text-gray-500 font-medium">E10 Partner</span>
          </div>

          {/* Structured Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              
              {/* Location Link */}
              <a 
                href={getMapsUrl(company.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/60 hover:bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-sm transition-all group"
                title="View on Google Maps"
              >
                <div className="p-2 bg-red-50 text-red-500 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors shrink-0">
                    <MapPin size={20} />
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Location</p>
                    <div className="flex items-center gap-1">
                        <p className="text-sm text-gray-800 font-medium truncate">{company.location}</p>
                        <ExternalLink size={12} className="text-gray-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
              </a>

              {/* Website Link */}
              <a 
                href={getWebsiteUrl(company.website)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/60 hover:bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all group"
                title={`Open ${company.website} in a new tab`}
              >
                <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors shrink-0">
                    <Globe size={20} />
                </div>
                <div className="overflow-hidden flex-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Website</p>
                    <div className="flex items-center gap-1 justify-between">
                         <p className="text-sm text-gray-800 font-medium truncate" title={company.website}>
                            {company.website}
                         </p>
                         <ExternalLink size={14} className="text-blue-400 shrink-0" />
                    </div>
                </div>
              </a>

              {/* Established Date */}
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-gray-100">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg">
                    <History size={20} />
                </div>
                <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Established</p>
                    <p className="text-sm text-gray-800 font-medium">{company.established}</p>
                </div>
              </div>

              {/* Slots Count */}
              <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl border border-gray-100">
                <div className={`p-2 rounded-lg ${availableSlotsCount > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                    <Calendar size={20} />
                </div>
                <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Availability</p>
                    <p className={`text-sm font-bold ${availableSlotsCount === 0 ? 'text-red-500' : 'text-green-600'}`}>
                        {availableSlotsCount} / {company.slots.length} Slots Open
                    </p>
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* AI Insight Section */}
      <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
         <div className="flex items-center gap-2 mb-2 text-indigo-700 font-semibold text-sm">
            <Sparkles size={16} />
            <span>AI Insight</span>
         </div>
         {loadingAi ? (
            <div className="flex items-center gap-2 text-indigo-400 text-sm">
                <Loader2 size={16} className="animate-spin" />
                Generating analysis...
            </div>
         ) : (
            <p className="text-indigo-900 text-sm leading-relaxed italic">
                "{aiInsight}"
            </p>
         )}
      </div>

      {/* Slots Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Select a Slot
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {company.slots.map((slot, index) => (
            <button
              key={slot.id}
              disabled={slot.isBooked}
              onClick={() => setSelectedSlotId(slot.id)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2
                ${slot.isBooked 
                    ? 'bg-gray-100 border-transparent cursor-not-allowed opacity-60' 
                    : selectedSlotId === slot.id
                        ? 'bg-accent/10 border-accent shadow-md scale-105'
                        : 'bg-white border-gray-100 hover:border-accent/50 hover:shadow-sm'
                }
              `}
            >
              <div className={`p-2 rounded-full ${slot.isBooked ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-accent'}`}>
                <User size={24} />
              </div>
              <span className="font-medium text-sm text-gray-700">
                {slot.isBooked ? 'Booked' : `Slot ${index + 1}`}
              </span>
              {slot.isBooked && (
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Booking Form - Only visible when a slot is selected */}
      {selectedSlotId && (
        <form onSubmit={handleBookingSubmit} className="mt-8 pt-6 border-t border-gray-200 animate-slide-up">
           <div className="flex flex-col md:flex-row gap-4 items-end">
             <div className="flex-grow w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                />
             </div>
             <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-accent hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
             >
                <Clock size={18} />
                Confirm Booking
             </button>
           </div>
           <p className="text-xs text-gray-500 mt-2 text-center md:text-left">
              Booking for Slot {company.slots.findIndex(s => s.id === selectedSlotId) + 1} at {company.name}
           </p>
        </form>
      )}
    </div>
  );
};

export default BookingCard;
import React, { useState, useEffect } from 'react';
import { Company, RegistrationFormData } from '../types';
import { User, Sparkles, Calendar, Clock, Loader2, X, MapPin, Globe, History, ExternalLink, FileText, Landmark, GraduationCap, Briefcase } from 'lucide-react';
import { generateCompanyInsight } from '../services/geminiService';

// Reusable components defined OUTSIDE the main component to prevent re-rendering lag
const InputField = ({ label, name, value, onChange, type = "text", required = true, placeholder = "", className = "" }: any) => (
  <div className={`mb-3 ${className}`}>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label} {required && '*'}</label>
    <input
      type={type}
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-sm"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = true }: any) => (
  <div className="mb-3">
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label} {required && '*'}</label>
    <select
      name={name}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-sm bg-white"
    >
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

interface BookingCardProps {
  company: Company;
  onBook: (companyId: string, slotId: string, formData: RegistrationFormData) => void;
  onClose: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ company, onBook, onClose }) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Registration Form State
  const [formData, setFormData] = useState<RegistrationFormData>({
    companyName: '',
    fullName: '',
    fatherName: '',
    motherName: '',
    panNumber: '',
    dob: '',
    uanNumber: '',
    permanentAddress: '',
    offerDate: '',
    joiningDate: '',
    joiningCTC: '',
    joiningDesignation: '',
    hikeDate: '',
    currentCTC: '',
    currentDesignation: '',
    resignationDate: '',
    relivingDate: '',
    pfRequired: 'No',
    highestQualification: '',
    yearOfPass: '',
    technology: '',
    bankName: '',
    bankAccountNumber: '',
    bankBranch: '',
    bankIFSCCode: '',
    gender: 'Male',
    marriageStatus: 'Single',
  });

  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Reset local state when company changes
  useEffect(() => {
    setSelectedSlotId(null);
    setFormData(prev => ({ ...prev, companyName: company.name })); // Pre-fill company name
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlotId) {
      setIsSubmitting(true);
      
      // Artificial small delay for better UX "processing" feel, and to ensure UI updates
      await new Promise(resolve => setTimeout(resolve, 600));

      onBook(company.id, selectedSlotId, formData);
      setSelectedSlotId(null);
      setIsSubmitting(false);
      
      // Reset sensitive fields
      setFormData(prev => ({
        ...prev,
        fullName: '',
        fatherName: '',
        motherName: '',
        panNumber: '',
        dob: '',
        uanNumber: '',
        permanentAddress: '',
      }));
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
    <div className="glass-panel w-full max-w-5xl mx-auto mt-8 p-6 md:p-8 rounded-2xl shadow-2xl animate-fade-in transition-all relative">
      
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

      {/* COMPREHENSIVE REGISTRATION FORM */}
      {selectedSlotId && (
        <form onSubmit={handleBookingSubmit} className="mt-8 pt-6 border-t border-gray-200 animate-slide-up">
           <div className="flex items-center gap-2 mb-6">
              <FileText size={24} className="text-accent" />
              <h3 className="text-xl font-bold text-gray-800">Registration Form</h3>
           </div>
           
           <div className="space-y-6">
             {/* Section 1: Personal Details */}
             <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
               <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Personal Details</h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Company Name" />
                  <InputField label="Full Name (As Per Aadhaar)" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" />
                  <InputField label="Father Name" name="fatherName" value={formData.fatherName} onChange={handleInputChange} placeholder="Father's Name" />
                  <InputField label="Mother Name" name="motherName" value={formData.motherName} onChange={handleInputChange} placeholder="Mother's Name" />
                  <InputField label="Date Of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
                  <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} options={['Male', 'Female', 'Other']} />
                  <SelectField label="Marriage Status" name="marriageStatus" value={formData.marriageStatus} onChange={handleInputChange} options={['Single', 'Married', 'Divorced', 'Widowed']} />
                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Permanent Address (As Per Aadhaar) *</label>
                    <textarea 
                      name="permanentAddress" 
                      required 
                      value={formData.permanentAddress} 
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-sm h-20 resize-none"
                    />
                  </div>
               </div>
             </div>

             {/* Section 2: Identity & Employment */}
             <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                    <Briefcase size={16} /> Employment & Identity
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField label="PAN Number" name="panNumber" value={formData.panNumber} onChange={handleInputChange} placeholder="ABCDE1234F" />
                  <InputField label="UAN Number" name="uanNumber" value={formData.uanNumber} onChange={handleInputChange} placeholder="Universal Account Number" />
                  <SelectField label="PF Required" name="pfRequired" value={formData.pfRequired} onChange={handleInputChange} options={['Yes', 'No']} />
                  
                  <InputField label="Offer Date" name="offerDate" type="date" value={formData.offerDate} onChange={handleInputChange} />
                  <InputField label="Joining Date" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleInputChange} />
                  <InputField label="Joining CTC" name="joiningCTC" value={formData.joiningCTC} onChange={handleInputChange} placeholder="e.g. 5.5 LPA" />
                  
                  <InputField label="Joining Designation" name="joiningDesignation" value={formData.joiningDesignation} onChange={handleInputChange} placeholder="e.g. Software Engineer" />
                  <InputField label="Hike Date" name="hikeDate" type="date" required={false} value={formData.hikeDate} onChange={handleInputChange} />
                  <InputField label="Current CTC" name="currentCTC" value={formData.currentCTC} onChange={handleInputChange} placeholder="e.g. 7.5 LPA" />
                  
                  <InputField label="Current Designation" name="currentDesignation" value={formData.currentDesignation} onChange={handleInputChange} placeholder="e.g. Senior Engineer" />
                  <InputField label="Resignation Date" name="resignationDate" type="date" required={false} value={formData.resignationDate} onChange={handleInputChange} />
                  <InputField label="Reliving Date (Last Working Day)" name="relivingDate" type="date" required={false} value={formData.relivingDate} onChange={handleInputChange} />
                </div>
             </div>

             {/* Section 3: Education */}
             <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                    <GraduationCap size={16} /> Education
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField label="Highest Education Qualification" name="highestQualification" value={formData.highestQualification} onChange={handleInputChange} placeholder="e.g. B.Tech" />
                  <InputField label="Year of Pass" name="yearOfPass" value={formData.yearOfPass} onChange={handleInputChange} placeholder="e.g. 2023" />
                  <InputField label="Technology (Course Name)" name="technology" value={formData.technology} onChange={handleInputChange} placeholder="e.g. Computer Science" />
                </div>
             </div>

             {/* Section 4: Banking */}
             <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                    <Landmark size={16} /> Banking Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Bank Name" name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="Bank Name" />
                  <InputField label="Bank Account Number" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleInputChange} placeholder="Account Number" />
                  <InputField label="Bank Branch" name="bankBranch" value={formData.bankBranch} onChange={handleInputChange} placeholder="Branch Name" />
                  <InputField label="Bank IFSC Code" name="bankIFSCCode" value={formData.bankIFSCCode} onChange={handleInputChange} placeholder="IFSC Code" />
                </div>
             </div>
           </div>

           <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-6 px-6 py-4 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-3
                  ${isSubmitting ? 'bg-gray-400 cursor-wait' : 'bg-accent hover:bg-blue-600 hover:shadow-xl'}
                `}
             >
                {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Clock size={20} />}
                {isSubmitting ? 'Processing Registration...' : 'Confirm Registration'}
             </button>
           <p className="text-xs text-gray-500 mt-3 text-center">
              Booking for Slot {company.slots.findIndex(s => s.id === selectedSlotId) + 1} at {company.name}
           </p>
        </form>
      )}
    </div>
  );
};

export default BookingCard;
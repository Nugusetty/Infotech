import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building2, CheckCircle2 } from 'lucide-react';
import { Company } from '../types';

interface DropdownProps {
  companies: Company[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  selectedCompanyOverride?: Company;
}

const Dropdown: React.FC<DropdownProps> = ({ companies, selectedId, onSelect, selectedCompanyOverride }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use the override if provided (useful when filtering lists), otherwise find in current list
  const selectedCompany = selectedCompanyOverride || companies.find((c) => c.id === selectedId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 bg-white border rounded-xl shadow-lg transition-all duration-300 h-[82px] ${
          isOpen ? 'ring-2 ring-accent border-transparent' : 'border-gray-200 hover:border-accent'
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`p-2 shrink-0 rounded-lg ${selectedCompany ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-500'}`}>
             <Building2 size={24} />
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-sm text-gray-500 font-medium">Select a Company</p>
            <h3 className="text-lg font-bold text-gray-900 leading-tight truncate">
              {selectedCompany ? selectedCompany.name : 'Choose from List'}
            </h3>
          </div>
        </div>
        <ChevronDown
          size={20}
          className={`shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto animate-slide-up">
          <div className="p-2">
            {companies.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    No companies found matching your search.
                </div>
            ) : (
                companies.map((company) => {
                  const availableSlots = company.slots.filter(s => !s.isBooked).length;
                  return (
                    <button
                      key={company.id}
                      onClick={() => {
                        onSelect(company.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors mb-1 ${
                        selectedId === company.id
                          ? 'bg-accent/5 border border-accent/20'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
                          {company.name.charAt(0)}
                        </div>
                        <div className="text-left overflow-hidden">
                          <p className={`font-semibold truncate ${selectedId === company.id ? 'text-accent' : 'text-gray-800'}`}>
                            {company.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{company.industry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                         <span className={`text-xs px-2 py-1 rounded-full ${
                            availableSlots > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                         }`}>
                            {availableSlots} left
                         </span>
                         {selectedId === company.id && <CheckCircle2 size={18} className="text-accent" />}
                      </div>
                    </button>
                  );
                })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
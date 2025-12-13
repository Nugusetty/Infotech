import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building2, CheckCircle2, Edit2, Plus } from 'lucide-react';
import { Company } from '../types';

interface DropdownProps {
  companies: Company[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  selectedCompanyOverride?: Company;
  isAdmin?: boolean;
  onAdd?: () => void;
  onEdit?: (company: Company) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  companies, 
  selectedId, 
  onSelect, 
  selectedCompanyOverride,
  isAdmin = false,
  onAdd,
  onEdit
}) => {
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
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto animate-slide-up flex flex-col">
          <div className="p-2 flex-grow">
            {companies.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                    No companies found matching your search.
                </div>
            ) : (
                companies.map((company) => {
                  const availableSlots = company.slots.filter(s => !s.isBooked).length;
                  return (
                    <div key={company.id} className="group relative flex items-center mb-1">
                      <button
                        onClick={() => {
                          onSelect(company.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          selectedId === company.id
                            ? 'bg-accent/5 border border-accent/20'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden pr-8">
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
                      
                      {/* Admin Edit Button - Overlays on the right side on hover */}
                      {isAdmin && onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(company);
                            setIsOpen(false);
                          }}
                          className="absolute right-12 p-2 bg-white text-gray-400 hover:text-accent hover:bg-gray-100 rounded-full shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          title="Edit Company"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                    </div>
                  );
                })
            )}
          </div>

          {/* Admin Add Button - Sticky Bottom */}
          {isAdmin && onAdd && (
            <div className="sticky bottom-0 p-2 bg-white/95 backdrop-blur-sm border-t border-gray-100">
               <button
                  onClick={() => {
                    onAdd();
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 flex items-center justify-center gap-2 bg-primary hover:bg-slate-800 text-white rounded-lg transition-colors font-medium text-sm"
               >
                 <Plus size={16} />
                 Add New Company
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
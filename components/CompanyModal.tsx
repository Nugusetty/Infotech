import React, { useState, useEffect } from 'react';
import { X, Save, Building2 } from 'lucide-react';
import { Company } from '../types';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: Omit<Company, 'id' | 'slots'>, id?: string) => void;
  initialData?: Company | null;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    established: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        industry: initialData.industry,
        location: initialData.location,
        website: initialData.website,
        established: initialData.established,
        description: initialData.description
      });
    } else {
      setFormData({
        name: '',
        industry: '',
        location: '',
        website: '',
        established: '',
        description: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, initialData?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Building2 size={20} className="text-accent" />
            {initialData ? 'Edit Company' : 'Add New Company'}
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-red-500 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                value={formData.industry}
                onChange={e => setFormData({...formData, industry: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Established Date</label>
              <input
                type="text"
                placeholder="YYYY-MM-DD"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                value={formData.established}
                onChange={e => setFormData({...formData, established: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                value={formData.website}
                onChange={e => setFormData({...formData, website: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-accent hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {initialData ? 'Update Company' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyModal;
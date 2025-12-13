import React, { useState } from 'react';
import Dropdown from './components/Dropdown';
import BookingCard from './components/BookingCard';
import BookingHistory from './components/BookingHistory';
import CompanyModal from './components/CompanyModal';
import LoginModal from './components/LoginModal';
import { Company } from './types';
import { INITIAL_COMPANIES } from './constants';
import { Briefcase, Search, Building2, ArrowRight, Lock, LogOut, UserCheck } from 'lucide-react';

const App: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [activeTab, setActiveTab] = useState<'booking' | 'history'>('booking');
  
  // Admin State
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  
  // Secret Login Trigger State
  const [secretClickCount, setSecretClickCount] = useState(0);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  // Filter companies based on search query
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    company.industry.toLowerCase().includes(searchQuery.toLowerCase()) || 
    company.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
    company.website.toLowerCase().includes(searchQuery.toLowerCase()) || 
    company.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handler for booking a slot
  const handleBookSlot = (companyId: string, slotId: string, userName: string, email: string, phone: string) => {
    setCompanies(prevCompanies => 
      prevCompanies.map(company => {
        if (company.id !== companyId) return company;
        
        const updatedSlots = company.slots.map(slot => {
          if (slot.id !== slotId) return slot;
          return { 
            ...slot, 
            isBooked: true, 
            bookedBy: userName,
            bookedEmail: email,
            bookedPhone: phone
          };
        });

        return { ...company, slots: updatedSlots };
      })
    );

    setNotification({
      message: `Successfully booked a slot at ${companies.find(c => c.id === companyId)?.name} for ${userName}!`,
      type: 'success'
    });

    // Clear notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  // Handler for deleting/cancelling a booking
  const handleDeleteBooking = (companyId: string, slotId: string) => {
    setCompanies(prevCompanies => 
      prevCompanies.map(company => {
        if (company.id !== companyId) return company;
        
        const updatedSlots = company.slots.map(slot => {
          if (slot.id !== slotId) return slot;
          // Reset the slot
          return { ...slot, isBooked: false, bookedBy: undefined, bookedEmail: undefined, bookedPhone: undefined };
        });

        return { ...company, slots: updatedSlots };
      })
    );

    setNotification({
      message: "Booking cancelled successfully.",
      type: 'success'
    });

    setTimeout(() => setNotification(null), 5000);
  };

  // Handler for saving (Add/Edit) a company
  const handleSaveCompany = (companyData: Omit<Company, 'id' | 'slots'>, id?: string) => {
    if (id) {
        // Edit existing company
        setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...companyData } : c));
        setNotification({ message: 'Company updated successfully', type: 'success' });
    } else {
        // Add new company
        const newCompany: Company = {
            id: `c-${Date.now()}`,
            ...companyData,
            slots: [
                { id: `s-${Date.now()}-1`, isBooked: false }, 
                { id: `s-${Date.now()}-2`, isBooked: false }, 
                { id: `s-${Date.now()}-3`, isBooked: false }
            ]
        };
        setCompanies(prev => [...prev, newCompany]);
        setNotification({ message: 'Company added successfully', type: 'success' });
    }
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      setAdminUser(null);
      setNotification({ message: 'Logged out successfully', type: 'success' });
      setTimeout(() => setNotification(null), 5000);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Secret Login Trigger
  const handleSecretTrigger = () => {
    if (isAdmin) return;
    
    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);
    
    // Trigger on 5 clicks
    if (newCount >= 5) {
        setIsLoginModalOpen(true);
        setSecretClickCount(0);
    }
    
    // Reset counter if idle for 2 seconds
    setTimeout(() => {
        setSecretClickCount(0);
    }, 2000);
  };

  // Step 1: Sign In Completed
  const handleSignInStageComplete = () => {
    setNotification({ message: 'Sign in is completed', type: 'success' });
    // Keep notification brief so user sees the Login form appear
    setTimeout(() => setNotification(null), 2000);
  };

  // Step 2: Final Login
  const handleLoginSuccess = (username: string) => {
    setIsAdmin(true);
    setAdminUser(username);
    setIsLoginModalOpen(false);
    setNotification({ message: `Welcome back, ${username}!`, type: 'success' });
    setTimeout(() => setNotification(null), 5000);
  };

  const totalBookings = companies.flatMap(c => c.slots).filter(s => s.isBooked).length;

  return (
    <div className="min-h-screen pb-20 px-4 md:px-0 relative">
        {/* Sign In / Sign Out Button Area (Top Right) - Only Visible when Admin is LOGGED IN */}
        {isAdmin && (
            <div className="absolute top-4 right-4 z-50 flex items-center gap-3 animate-fade-in">
                {adminUser && (
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/50 backdrop-blur-sm rounded-full border border-gray-100 text-sm font-semibold text-gray-700 shadow-sm">
                        <div className="bg-green-100 text-green-600 p-1 rounded-full">
                            <UserCheck size={14} />
                        </div>
                        <span>{adminUser}</span>
                    </div>
                )}
                
                <button
                    onClick={handleAdminToggle}
                    className="p-2.5 rounded-full transition-all shadow-sm border flex items-center justify-center bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:shadow-md"
                    title="Sign Out"
                >
                    <LogOut size={20} />
                </button>
            </div>
        )}

        {/* Header */}
        <header className="pt-8 pb-4 text-center">
            {/* Secret Click Trigger on the Title/Logo Container */}
            <div 
                onClick={handleSecretTrigger}
                className="inline-flex items-center justify-center gap-2 mb-2 p-3 bg-white rounded-full shadow-md cursor-default select-none transition-transform active:scale-95"
                title="" // Empty title to not give it away
            >
                <Briefcase className="text-accent" size={24} />
                <span className="font-bold text-xl text-primary">AIKYA-AI Infotech PVT LTD</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-2">
                Exclusive Company Access
            </h1>
            <p className="text-secondary text-lg max-w-lg mx-auto mb-6">
                Secure your spot with the world's top innovation leaders.
            </p>
            
            {/* Tab Navigation */}
            <div className="flex justify-center mb-4">
                <div className="bg-white p-1 rounded-xl shadow-md border border-gray-100 inline-flex">
                    <button 
                        onClick={() => setActiveTab('booking')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'booking' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-primary'}`}
                    >
                        Make a Booking
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-primary'}`}
                    >
                        Bookings
                        {totalBookings > 0 && (
                            <span className={`px-2 py-0.5 rounded text-xs ${activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                {totalBookings}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>

        {activeTab === 'booking' ? (
            /* Booking View */
            <main className="container mx-auto max-w-5xl mt-4">
                {/* Search & Dropdown Row */}
                <div className="flex flex-col md:flex-row gap-4 w-full items-start relative z-40 transition-all duration-500">
                    {/* Search Bar */}
                    <div className="w-full md:w-1/2 relative">
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={22} />
                        </div>
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, location, or industry..."
                            className="w-full pl-12 pr-4 h-[82px] rounded-xl border border-gray-200 shadow-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-lg transition-all hover:border-accent"
                        />
                    </div>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="w-full md:w-1/2">
                        <Dropdown 
                            companies={filteredCompanies} 
                            selectedId={selectedCompanyId} 
                            onSelect={setSelectedCompanyId} 
                            selectedCompanyOverride={selectedCompany}
                            isAdmin={isAdmin}
                            onAdd={() => {
                                setEditingCompany(null);
                                setIsCompanyModalOpen(true);
                            }}
                            onEdit={(company) => {
                                setEditingCompany(company);
                                setIsCompanyModalOpen(true);
                            }}
                        />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="mt-8 relative z-10 min-h-[400px]">
                    
                    {/* Scenario 1: Company Selected -> Show Booking Card */}
                    {selectedCompany ? (
                        <div className="animate-fade-in">
                            <BookingCard 
                                company={selectedCompany} 
                                onBook={handleBookSlot} 
                                onClose={() => setSelectedCompanyId(null)}
                            />
                        </div>
                    ) : searchQuery ? (
                        /* Scenario 2: Searching but no selection -> Show Grid of Results */
                        <div className="animate-fade-in">
                            <h3 className="text-gray-500 mb-4 font-medium flex items-center gap-2">
                                <Search size={16} />
                                Search Results ({filteredCompanies.length})
                            </h3>
                            {filteredCompanies.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <p className="text-gray-500">No companies found matching "{searchQuery}"</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    {filteredCompanies.map(company => {
                                        const available = company.slots.filter(s => !s.isBooked).length;
                                        return (
                                            <div key={company.id} className="relative group">
                                                <button
                                                    onClick={() => setSelectedCompanyId(company.id)}
                                                    className="w-full bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-accent hover:-translate-y-1 transition-all text-left"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="bg-gray-100 p-2 rounded-lg text-gray-600 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                                                            <Building2 size={20} />
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {available} slots left
                                                        </span>
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{company.name}</h4>
                                                    <p className="text-xs text-gray-500 mb-3">{company.industry}</p>
                                                    <p className="text-sm text-gray-600 line-clamp-2 mb-3 h-10">{company.description}</p>
                                                    
                                                    <div className="flex items-center text-accent text-sm font-semibold mt-auto">
                                                        View Details <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </button>
                                                
                                                {/* Edit Button on Card (Admin Only) */}
                                                {isAdmin && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingCompany(company);
                                                            setIsCompanyModalOpen(true);
                                                        }}
                                                        className="absolute top-4 right-4 p-2 bg-white text-gray-400 hover:text-accent hover:bg-blue-50 rounded-full shadow-md border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                                        title="Edit Company"
                                                    >
                                                        <Building2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Scenario 3: Initial State -> Empty Prompt */
                        <div className="mt-16 text-center text-gray-400 animate-fade-in">
                            <p className="text-sm">Select a company from the dropdown or search above to view details.</p>
                        </div>
                    )}
                </div>
            </main>
        ) : (
            /* History View */
            <main className="container mx-auto px-4">
                <BookingHistory companies={companies} onDelete={handleDeleteBooking} isAdmin={isAdmin} />
            </main>
        )}

        {/* Auth Modal */}
        <LoginModal 
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLogin={handleLoginSuccess}
            onSignInComplete={handleSignInStageComplete}
        />

        {/* Company Modal for Add/Edit */}
        <CompanyModal 
            isOpen={isCompanyModalOpen} 
            onClose={() => setIsCompanyModalOpen(false)} 
            onSave={handleSaveCompany} 
            initialData={editingCompany}
        />

        {/* Notification Toast */}
        {notification && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up w-max max-w-sm text-center">
                <div className={`px-6 py-3 rounded-full shadow-xl text-white font-medium flex items-center justify-center gap-2 ${
                    notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                    {/* Image/Icon removed as requested */}
                    {notification.message}
                </div>
            </div>
        )}
    </div>
  );
};

export default App;
import React, { useState } from 'react';
import { Company, RegistrationFormData } from '../types';
import { User, CalendarCheck, Trash2, Share2 } from 'lucide-react';
import ShareModal from './ShareModal';

interface BookingHistoryProps {
  companies: Company[];
  onDelete: (companyId: string, slotId: string) => void;
  isAdmin: boolean;
}

interface ShareData {
    companyName: string;
    designation: string;
    candidateName: string;
    registrationDetails?: RegistrationFormData;
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ companies, onDelete, isAdmin }) => {
  const [selectedBookingForShare, setSelectedBookingForShare] = useState<ShareData | null>(null);

  // Extract all booked slots across all companies
  const allBookings = companies.flatMap(company => 
    company.slots
      .filter(slot => slot.isBooked)
      .map(slot => ({
        companyName: company.name,
        slotId: slot.id,
        userName: slot.bookedBy,
        registrationDetails: slot.registrationDetails,
        companyIndustry: company.industry,
        companyId: company.id
      }))
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-in mt-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                    <CalendarCheck size={24} />
                </div>
                Booking History
                <span className="text-sm font-normal text-gray-500 ml-auto bg-gray-100 px-3 py-1 rounded-full">
                    Total: {allBookings.length}
                </span>
            </h2>
            
            {allBookings.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <User size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No bookings yet</p>
                    <p className="text-sm">Select a company from the main tab to make a reservation.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {allBookings.map((booking) => (
                        <div key={`${booking.companyId}-${booking.slotId}`} className="flex flex-col p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-accent/30 transition-colors gap-4 group">
                            
                            {/* Header Row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                                        {booking.userName?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{booking.userName}</h3>
                                        <div className="text-xs text-gray-500">{booking.registrationDetails?.joiningDesignation || 'Candidate'}</div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    {/* Share Button */}
                                    <button 
                                        onClick={() => setSelectedBookingForShare({
                                            companyName: booking.companyName,
                                            designation: booking.registrationDetails?.joiningDesignation || 'New Role',
                                            candidateName: booking.userName || 'Candidate',
                                            registrationDetails: booking.registrationDetails
                                        })}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                                        title="Share Booking"
                                    >
                                        <Share2 size={18} />
                                    </button>

                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        Confirmed
                                    </span>
                                    
                                    {isAdmin && (
                                        <button
                                            onClick={() => onDelete(booking.companyId, booking.slotId)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                            title="Cancel Booking (Admin Only)"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm border-t border-gray-200 pt-3">
                                <div className="p-2 bg-white rounded border border-gray-100">
                                    <span className="block text-xs text-gray-400 uppercase">Company</span>
                                    <span className="font-medium text-gray-800">{booking.companyName}</span>
                                </div>
                                {booking.registrationDetails && (
                                    <>
                                        <div className="p-2 bg-white rounded border border-gray-100">
                                            <span className="block text-xs text-gray-400 uppercase">Father Name</span>
                                            <span className="font-medium text-gray-800">{booking.registrationDetails.fatherName}</span>
                                        </div>
                                        <div className="p-2 bg-white rounded border border-gray-100">
                                            <span className="block text-xs text-gray-400 uppercase">PAN</span>
                                            <span className="font-medium text-gray-800">{booking.registrationDetails.panNumber}</span>
                                        </div>
                                        <div className="p-2 bg-white rounded border border-gray-100">
                                            <span className="block text-xs text-gray-400 uppercase">Mobile / CTC</span>
                                            <span className="font-medium text-gray-800">{booking.registrationDetails.currentCTC || 'N/A'}</span>
                                        </div>
                                         <div className="p-2 bg-white rounded border border-gray-100">
                                            <span className="block text-xs text-gray-400 uppercase">Joining Date</span>
                                            <span className="font-medium text-gray-800">{booking.registrationDetails.joiningDate || 'N/A'}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Share Modal */}
            <ShareModal 
                isOpen={!!selectedBookingForShare}
                onClose={() => setSelectedBookingForShare(null)}
                bookingDetails={selectedBookingForShare}
            />
        </div>
    </div>
  );
};

export default BookingHistory;
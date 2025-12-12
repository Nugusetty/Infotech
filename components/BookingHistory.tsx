import React from 'react';
import { Company } from '../types';
import { User, Building2, CalendarCheck, Trash2 } from 'lucide-react';

interface BookingHistoryProps {
  companies: Company[];
  onDelete: (companyId: string, slotId: string) => void;
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ companies, onDelete }) => {
  // Extract all booked slots across all companies
  const allBookings = companies.flatMap(company => 
    company.slots
      .filter(slot => slot.isBooked)
      .map(slot => ({
        companyName: company.name,
        slotId: slot.id,
        userName: slot.bookedBy,
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
                <div className="grid gap-4">
                    {allBookings.map((booking, idx) => (
                        <div key={`${booking.companyId}-${booking.slotId}`} className="flex flex-col sm:flex-row sm:items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-accent/30 transition-colors gap-4 group">
                            {/* Avatar */}
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                                {booking.userName?.charAt(0).toUpperCase()}
                            </div>
                            
                            {/* User & Company Details */}
                            <div className="flex-grow">
                                <h3 className="font-bold text-gray-900 text-lg">{booking.userName}</h3>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                                    <Building2 size={14} className="text-accent" />
                                    <span className="font-medium">{booking.companyName}</span>
                                    <span className="hidden sm:inline text-gray-300">|</span>
                                    <span className="text-xs uppercase bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-600">
                                        {booking.companyIndustry}
                                    </span>
                                </div>
                            </div>

                            {/* Status & Actions */}
                            <div className="shrink-0 flex items-center gap-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    Confirmed
                                </span>
                                
                                <button
                                    onClick={() => onDelete(booking.companyId, booking.slotId)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                    title="Cancel Booking"
                                    aria-label="Delete booking"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default BookingHistory;
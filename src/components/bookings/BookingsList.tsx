import React, { useState } from 'react';
import { Booking } from '../../types';
import BookingCard from './BookingCard';
import { useBookingStore } from '../../store/useBookingStore';
import { useRoomStore } from '../../store/useRoomStore';
import { format, parseISO, addDays } from 'date-fns';
import { Search } from 'lucide-react';

const BookingsList: React.FC = () => {
  const { getAllBookings } = useBookingStore();
  const { getRoomById } = useRoomStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const bookings = getAllBookings();
  const today = new Date();
  
  // Sort bookings by date (most recent first)
  const sortedBookings = [...bookings].sort((a, b) => {
    const aIsActive = a.checkInDateTime && !a.checkOutDateTime;
    const bIsActive = b.checkInDateTime && !b.checkOutDateTime;
  
    if (aIsActive && !bIsActive) return -1;
    if (!aIsActive && bIsActive) return 1;
  
    const aIsFuture = !a.checkInDateTime;
    const bIsFuture = !b.checkInDateTime;
  
    if (aIsFuture && !bIsFuture) return -1;
    if (!aIsFuture && bIsFuture) return 1;
  
    return new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime();
  });

  
  const filteredBookings = sortedBookings.filter(booking => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.guestName.toLowerCase().includes(searchLower) ||
      booking.nationalId.toLowerCase().includes(searchLower) ||
      booking.phone.toLowerCase().includes(searchLower) ||
      getRoomById(booking.roomId)?.roomNumber.includes(searchTerm)
    );
  });
  
  const handleBookingUpdated = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center bg-white rounded-lg shadow-lg p-2">
        <Search className="h-5 w-5 text-gray-400 ml-2 mr-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by guest name, ID, phone or room number..."
          className="flex-1 px-2 py-2 border-0 focus:ring-0 focus:outline-none"
        />
      </div>
      
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No bookings found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map(booking => {
            const room = getRoomById(booking.roomId);
            const isActive = booking.checkInDateTime && !booking.checkOutDateTime;
            
            return (
              <BookingCard 
  key={`${booking.id}-${refreshKey}`} 
  booking={booking}
  isActive={isActive}
  showRoom={true}
  onUpdate={handleBookingUpdated}
  roomNumber={room?.roomNumber}   // ✅ this is new prop
/>


            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingsList;
import React, { useState } from 'react';
import { useGuestStore } from '../../store/useGuestStore';
import { useBookingStore } from '../../store/useBookingStore';
import { useRoomStore } from '../../store/useRoomStore';
import { User, Phone, CreditCard, Calendar, Search } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const GuestsList: React.FC = () => {
  const { getAllGuests } = useGuestStore();
  const { getBookingsForGuest } = useBookingStore();
  const { getRoomById } = useRoomStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const guests = getAllGuests();
  
  const filteredGuests = guests.filter(guest => {
    if (!searchTerm) return true;

    
    const searchLower = searchTerm.toLowerCase();
    return (
      guest.name.toLowerCase().includes(searchLower) ||
      guest.nationalId.toLowerCase().includes(searchLower) ||
      guest.phone.toLowerCase().includes(searchLower)
    );
  });
  
  const sortedGuests = [...filteredGuests].sort((a, b) => {
    const aBookingCount = getBookingsForGuest(a.id).length;
    const bBookingCount = getBookingsForGuest(b.id).length;
    return bBookingCount - aBookingCount;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center bg-white rounded-lg shadow-lg p-2">
        <Search className="h-5 w-5 text-gray-400 ml-2 mr-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, ID or phone..."
          className="input border-0 focus:ring-0"
        />
      </div>
      
      {sortedGuests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No guests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedGuests.map(guest => {
            const bookings = getBookingsForGuest(guest.id);
            const activeBooking = bookings.find(b => b.checkInDateTime && !b.checkOutDateTime);
            const pastBookings = bookings.filter(b => b.checkOutDateTime);
            const futureBookings = bookings.filter(b => !b.checkInDateTime && !b.cancelledAt);
            const cancelledBookings = bookings.filter(b => b.cancelledAt).length;

            return (
              <div key={guest.id} className="card">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-3">{guest.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-700">{guest.nationalId}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-700">{guest.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-gray-700">
                        {bookings.length} Bookings{cancelledBookings > 0 && ` (${cancelledBookings} Cancelled)`}
                      </span>
                    </div>
                  </div>
                  
                  {activeBooking && (
                    <div className="bg-teal-50 p-3 rounded-md mb-3">
                      <p className="text-sm font-medium text-teal-800">Currently Staying</p>
                      <p className="text-xs text-teal-700">
                        Room: {getRoomById(activeBooking.roomId).roomNumber}, 
                        Check-in: {format(parseISO(activeBooking.checkInDateTime!), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  )}
                  
                  {futureBookings.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-1">Upcoming Stays</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {futureBookings.slice(0, 2).map(booking => (
                          <li key={booking.id}>
                            Room: {getRoomById(booking.roomId).roomNumber}, {format(parseISO(booking.bookingDate), 'dd/MM/yyyy')} 
                            ({booking.durationDays} days)
                          </li>
                        ))}
                        {futureBookings.length > 2 && (
                          <li className="text-teal-600 font-medium">
                            + {futureBookings.length - 2} more upcoming bookings
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {pastBookings.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Past Stays</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {pastBookings.slice(0, 2).map(booking => (
                          <li key={booking.id}>
                            Room: {getRoomById(booking.roomId).roomNumber}, {format(parseISO(booking.bookingDate), 'dd/MM/yyyy')} 
                            ({booking.durationDays} days)
                          </li>
                        ))}
                        {pastBookings.length > 2 && (
                          <li className="text-gray-500 font-medium">
                            + {pastBookings.length - 2} more past bookings
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GuestsList;
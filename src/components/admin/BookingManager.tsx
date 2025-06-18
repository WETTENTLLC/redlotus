import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface BookingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  instagram: string;
  tiktok: string;
  twitter: string;
  eventDate: string;
  eventType: string;
  offer: string;
  offerAmount: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'negotiating';
  submittedAt: string;
  paymentDetails?: any;
  consultationFee?: number;
  documents?: string[];
  adminNotes?: string;
}

const BookingManager: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const bookingList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BookingRequest[];
      setBookings(bookingList);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string, notes?: string) => {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date().toISOString()
      };
      
      if (notes) {
        updateData.adminNotes = notes;
      }

      await updateDoc(doc(db, 'bookings', bookingId), updateData);
      fetchBookings();
      setSelectedBooking(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    if (confirm('Are you sure you want to delete this booking request?')) {
      try {
        await deleteDoc(doc(db, 'bookings', bookingId));
        fetchBookings();
        setSelectedBooking(null);
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'negotiating': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-lotus"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Booking Requests</h2>
        <div className="text-sm text-gray-600">
          Total: {bookings.length} | Pending: {bookings.filter(b => b.status === 'pending').length}
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All Booking Requests</h3>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className={`border rounded-lg p-4 cursor-pointer transition ${
                selectedBooking?.id === booking.id ? 'border-red-lotus bg-red-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">{booking.name}</h4>
                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(booking.status)}`}>
                  {booking.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{booking.eventType}</p>
              <p className="text-sm text-gray-600 mb-1">
                📧 {booking.email} | 📱 {booking.phone}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                💰 Offer: {formatCurrency(booking.offerAmount)}
              </p>
              <p className="text-xs text-gray-400">
                📅 {new Date(booking.submittedAt).toLocaleDateString()} at {new Date(booking.submittedAt).toLocaleTimeString()}
              </p>
            </div>
          ))}
          
          {bookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No booking requests yet.</p>
            </div>
          )}
        </div>

        {/* Booking Details */}
        <div className="space-y-4">
          {selectedBooking ? (
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <h3 className="text-xl font-bold mb-4">Booking Details</h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="font-medium">{selectedBooking.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Company</label>
                    <p className="font-medium">{selectedBooking.company || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="font-medium">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="font-medium">{selectedBooking.phone}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Social Media</label>
                  <div className="space-y-1">
                    {selectedBooking.instagram && (
                      <p className="text-sm">📷 Instagram: {selectedBooking.instagram}</p>
                    )}
                    {selectedBooking.tiktok && (
                      <p className="text-sm">🎵 TikTok: {selectedBooking.tiktok}</p>
                    )}
                    {selectedBooking.twitter && (
                      <p className="text-sm">🐦 Twitter: {selectedBooking.twitter}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Event Type</label>
                    <p className="font-medium">{selectedBooking.eventType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Event Date</label>
                    <p className="font-medium">{selectedBooking.eventDate}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Offer Amount</label>
                  <p className="font-medium text-lg text-green-600">{formatCurrency(selectedBooking.offerAmount)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Offer Details</label>
                  <p className="font-medium">{selectedBooking.offer}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-sm">{selectedBooking.description}</p>
                </div>

                {selectedBooking.paymentDetails && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Payment Status</label>
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-sm text-green-800">
                        ✅ Consultation fee paid: {formatCurrency(selectedBooking.consultationFee || 25)}
                      </p>
                      <p className="text-xs text-green-600">
                        Payment ID: {selectedBooking.paymentDetails.id || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}

                {selectedBooking.adminNotes && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Admin Notes</label>
                    <p className="text-sm bg-gray-50 p-2 rounded">{selectedBooking.adminNotes}</p>
                  </div>
                )}

                {/* Admin Notes Input */}
                <div>
                  <label className="text-sm font-medium text-gray-600">Add Admin Notes</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md h-20 text-sm"
                    placeholder="Add notes about this booking..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateBookingStatus(selectedBooking.id, 'approved', adminNotes)}
                      className="bg-green-500 text-white py-2 px-4 rounded text-sm hover:bg-green-600 transition"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => updateBookingStatus(selectedBooking.id, 'rejected', adminNotes)}
                      className="bg-red-500 text-white py-2 px-4 rounded text-sm hover:bg-red-600 transition"
                    >
                      ❌ Reject
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateBookingStatus(selectedBooking.id, 'negotiating', adminNotes)}
                      className="bg-blue-500 text-white py-2 px-4 rounded text-sm hover:bg-blue-600 transition"
                    >
                      💬 Negotiate
                    </button>
                    <button
                      onClick={() => deleteBooking(selectedBooking.id)}
                      className="bg-gray-500 text-white py-2 px-4 rounded text-sm hover:bg-gray-600 transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-6 bg-gray-50 text-center">
              <p className="text-gray-500">Select a booking request to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingManager;

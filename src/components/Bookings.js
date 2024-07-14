import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BookingsContext } from '../context/BookingsContext';
import '../App.css';

const Bookings = () => {
  const { bookings, setBookings } = useContext(BookingsContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchAllBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    return (
      (booking.bangkasName && booking.bangkasName.toLowerCase().includes(lowerCaseTerm)) ||
      (booking.destination && booking.destination.toLowerCase().includes(lowerCaseTerm)) ||
      (booking.date && new Date(booking.date).toLocaleDateString().includes(lowerCaseTerm)) ||
      (booking.totalPrice && booking.totalPrice.toString().includes(lowerCaseTerm))
    );
  });

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${id}`);
        setBookings(prevBookings => prevBookings.filter(booking => booking._id !== id));
        setSelectedBooking(null);
      } catch (error) {
        console.error('Error cancelling booking:', error);
      }
    }
  };

  return (
    <div className="container mt-5 text-center">
      <div className="outer-container">
        <div className="header-container d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-dark custom-heading-margin">Bookings</h1>
          <button className="btn btn-primary" onClick={fetchAllBookings}>View All Activities</button>
        </div>
        <div className="search-container mb-4">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control search-input"
          />
        </div>
        <div className="inner-container">
          {filteredBookings.length > 0 ? (
            <div className="bookings-grid">
              {filteredBookings.map((booking, index) => (
                <div key={index} className="card booking-card" onClick={() => handleBookingClick(booking)}>
                  <div className="card-body">
                    <h5 className="card-title">Booking {index + 1}</h5>
                    <p className="card-text"><strong>Bangka:</strong> {booking.bangkasName}</p>
                    <p className="card-text"><strong>Destination:</strong> {booking.destination}</p>
                    <p className="card-text"><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                    <p className="card-text"><strong>Total Price:</strong> {booking.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">No Results Found</div>
          )}
        </div>
        {selectedBooking && (
          <div className="modal" onClick={() => setSelectedBooking(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close" onClick={() => setSelectedBooking(null)}>&times;</span>
              <h3>Booking Details</h3>
              <p><strong>Bangka:</strong> {selectedBooking.bangkasName}</p>
              <p><strong>Destination:</strong> {selectedBooking.destination}</p>
              <p><strong>Date:</strong> {new Date(selectedBooking.date).toLocaleDateString()}</p>
              <p><strong>Total Price:</strong> {selectedBooking.totalPrice}</p>
              <button className="btn btn-danger" onClick={() => handleCancelBooking(selectedBooking._id)}>Cancel Booking</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;

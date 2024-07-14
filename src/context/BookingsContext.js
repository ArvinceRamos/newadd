import React, { createContext, useState } from 'react';

export const BookingsContext = createContext();

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  const addBooking = (newBooking) => {
    setBookings((prevBookings) => [...prevBookings, newBooking]);
  };

  return (
    <BookingsContext.Provider value={{ bookings, addBooking, setBookings }}>
      {children}
    </BookingsContext.Provider>
  );
};

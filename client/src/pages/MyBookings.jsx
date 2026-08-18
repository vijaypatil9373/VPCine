import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function MyBookings() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${API_URL}/api/bookings/user/${user.id}`);
        if (!response.ok) throw new Error('Failed to load bookings');
        setBookings(await response.json());
      } catch (err) {
        console.error('Booking fetch error:', err);
        setError('Could not load your bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, isLoaded, isSignedIn]);

  return (
    <section className="themed-page bookings-page">
      <div className="page-banner content">
        <span className="page-kicker">Your Movie History</span>
        <h1>My Bookings</h1>
        <p>All your reserved seats and movie plans in one place.</p>
      </div>

      <div className="content booking-page-content">
        {!isLoaded || loading ? (
          <div className="state-card">Loading bookings...</div>
        ) : error ? (
          <div className="state-card error-state">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="state-card">
            <h2>No bookings yet</h2>
            <p>Book your first movie on VPCine.</p>
          </div>
        ) : (
          <div className="booking-list">
            {bookings.map((booking) => {
              const show = booking.show;
              const movie = show?.movie;
              return (
                <div className="booking-card" key={booking._id}>
                  {movie?.poster_path && (
                    <img src={movie.poster_path} alt={movie.title} />
                  )}
                  <div>
                    <h2>{movie?.title || 'Movie'}</h2>
                    {show?.showDateTime && (
                      <p>{new Date(show.showDateTime).toLocaleString()}</p>
                    )}
                    <p>Tickets: {booking.bookedSeats?.join(', ')}</p>
                    <p>{booking.bookedSeats?.length || 0} Ticket{booking.bookedSeats?.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="booking-price">
                    <b>${booking.amount}</b>
                    <span className={booking.isPaid ? 'paid' : 'pending'}>
                      {booking.isPaid ? 'Paid' : 'Reserved'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

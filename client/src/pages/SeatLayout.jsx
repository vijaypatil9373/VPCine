import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, SignInButton } from '@clerk/react';
import { dummyShowsData, assets } from '../assets/assets.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const MAX_VISIBLE_TIMINGS = 6;

const localDateKey = (value) => {
  const d = new Date(value);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export default function SeatLayout() {
  const { id, date } = useParams();
  const nav = useNavigate();
  const { isSignedIn, user } = useUser();
  const movie = dummyShowsData.find((x) => String(x.id) === String(id)) || dummyShowsData[0];

  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [sel, setSel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showsLoading, setShowsLoading] = useState(true);

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  useEffect(() => {
    const loadShows = async () => {
      try {
        setShowsLoading(true);
        const response = await fetch(`${API_URL}/api/shows/movie/${id}`);
        if (!response.ok) throw new Error('Could not load shows');
        const data = await response.json();

        const exactDateShows = data.filter((show) => localDateKey(show.showDateTime) === date);
        const availableShows = (exactDateShows.length ? exactDateShows : data)
          .filter((show) => new Date(show.showDateTime).getTime() >= Date.now() - 60 * 60 * 1000)
          .slice(0, MAX_VISIBLE_TIMINGS);

        setShows(availableShows);
        setSelectedShow(availableShows[0] || null);
        setSel([]);
      } catch (error) {
        console.error('Failed to load shows:', error);
        setShows([]);
        setSelectedShow(null);
      } finally {
        setShowsLoading(false);
      }
    };

    loadShows();
  }, [id, date]);

  const toggle = (seat) => {
    if (!selectedShow || selectedShow.occupiedSeats?.[seat]) return;
    setSel((current) =>
      current.includes(seat)
        ? current.filter((x) => x !== seat)
        : current.length < 5
          ? [...current, seat]
          : current
    );
  };

  const selectShow = (show) => {
    setSelectedShow(show);
    setSel([]);
  };

  const formatTime = (value) =>
    new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleBooking = async () => {
    if (!isSignedIn || !selectedShow || !sel.length) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.fullName || user.firstName || user.primaryEmailAddress?.emailAddress || 'VPCine User',
          showId: selectedShow._id,
          seats: sel,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Booking failed');
        return;
      }

      alert('Booking successful!');
      nav('/my-bookings');
    } catch (error) {
      console.error('Booking Error:', error);
      alert('Something went wrong while booking.');
    } finally {
      setLoading(false);
    }
  };

  if (showsLoading) {
    return <section className="seat-page content"><h2>Loading shows...</h2></section>;
  }

  return (
    <section className="seat-page content">
      <div className="time-panel">
        <h3>Available Timings</h3>
        {shows.length === 0 ? (
          <p>No shows available for this date.</p>
        ) : (
          shows.map((show) => (
            <button
              key={show._id}
              className={selectedShow?._id === show._id ? 'active' : ''}
              onClick={() => selectShow(show)}
            >
              ◷ {formatTime(show.showDateTime)}
            </button>
          ))
        )}
      </div>

      <div className="seat-area">
        <h2>Select your seat</h2>
        <p>
          {movie.title}{date ? ` · ${new Date(`${date}T12:00:00`).toDateString()}` : ''}
          {selectedShow ? ` · ${formatTime(selectedShow.showDateTime)}` : ''}
        </p>

        <div className="screen">
          <img src={assets.screenImage} alt="Cinema Screen" />
          <span>SCREEN SIDE</span>
        </div>

        <div className="seats">
          {rows.map((row) => (
            <div className="seat-row" key={row}>
              <span>{row}</span>
              {Array.from({ length: 10 }, (_, index) => {
                const seat = row + (index + 1);
                const booked = Boolean(selectedShow?.occupiedSeats?.[seat]);
                return (
                  <button
                    key={seat}
                    disabled={booked || !selectedShow}
                    className={booked ? 'booked' : sel.includes(seat) ? 'selected' : ''}
                    onClick={() => toggle(seat)}
                    title={booked ? 'Already booked' : `Seat ${seat}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="booking-bar">
          <span>{sel.length} seat{sel.length !== 1 ? 's' : ''} selected</span>
          <b>${sel.length * (selectedShow?.showPrice || 49)}</b>

          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="primary" disabled={!sel.length}>Login to Book →</button>
            </SignInButton>
          ) : (
            <button
              className="primary"
              disabled={!sel.length || loading || !selectedShow}
              onClick={handleBooking}
            >
              {loading ? 'Booking...' : 'Proceed to Book →'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
